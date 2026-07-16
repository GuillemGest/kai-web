import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'
import type { IPlanRepository } from '../domain/IPlanRepository'
import {
  planChangeTiming,
  type BillingPeriod,
  type PlanChangeTiming,
} from '../domain/Plan'
import {
  SamePlanError,
  SubscriptionNotFoundError,
  SubscriptionNotManageableError,
} from '../domain/subscriptionErrors'
import { PlanNotFoundError, PlanNotPurchasableError } from './CreateCheckoutSession'

export interface ChangeSubscriptionPlanRequest {
  email: string
  subscriptionId: string
  planId: string
  period: BillingPeriod
}

export interface ChangeSubscriptionPlanResult {
  timing: PlanChangeTiming
  /**
   * Página de factura alojada de Stripe donde confirmar el cargo (y poder
   * cambiar de tarjeta) de un upgrade con importe pendiente. `null` en
   * downgrades o si no queda importe por cobrar.
   */
  paymentUrl: string | null
}

/**
 * Cambia el plan de una suscripción activa aplicando la regla de negocio de
 * `planChangeTiming`: los upgrades dejan pendiente de pago SOLO la diferencia
 * prorrateada del periodo en curso (a confirmar en Stripe, ver `paymentUrl`);
 * los downgrades se programan para la siguiente renovación (se mantiene el
 * plan grande ya pagado hasta entonces, sin cobro ahora).
 *
 * Devuelve el timing aplicado y, si aplica, la URL de pago para que la UI
 * redirija al usuario a confirmarlo.
 */
export class ChangeSubscriptionPlan {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly planRepository: IPlanRepository,
  ) {}

  async execute(request: ChangeSubscriptionPlanRequest): Promise<ChangeSubscriptionPlanResult> {
    const { email, subscriptionId, planId, period } = request

    const subscriptions = await this.subscriptionRepository.listByEmail(email)
    const subscription = subscriptions.find(
      (sub) => sub.stripeSubscriptionId === subscriptionId || sub.id === subscriptionId,
    )
    if (!subscription) throw new SubscriptionNotFoundError(subscriptionId)
    if (!subscription.isManageable) throw new SubscriptionNotManageableError(subscriptionId)
    if (subscription.planId === planId) throw new SamePlanError(planId)

    const plans = await this.planRepository.getAll()
    const target = plans.find((plan) => plan.id === planId)
    if (!target) throw new PlanNotFoundError(planId)
    // Se valida con `custom` (dato de dominio disponible también en cliente) y
    // no con `isPurchasable`: los `price_...` solo existen en el entorno del
    // servidor, y el repo de Stripe ya falla si el precio del periodo no está.
    if (target.custom) throw new PlanNotPurchasableError(planId, period)

    // Si el plan actual no está en el catálogo (alta manual en el dashboard),
    // no hay precio con el que comparar: se aplica el camino conservador
    // (fin de periodo), que nunca cobra de más.
    const current = plans.find((plan) => plan.id === subscription.planId)
    const timing = current ? planChangeTiming(current, target) : 'at_period_end'

    const { paymentUrl } = await this.subscriptionRepository.changePlan(
      email,
      subscriptionId,
      target,
      period,
      timing,
    )
    return { timing, paymentUrl }
  }
}
