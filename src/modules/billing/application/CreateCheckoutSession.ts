import type { IPlanRepository } from '../domain/IPlanRepository'
import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'
import type {
  ICheckoutGateway,
  CheckoutLineItem,
  CheckoutSession,
} from '../domain/ICheckoutGateway'
import type { BillingPeriod } from '../domain/Plan'
import { BillingDetails, type BillingDetailsPrimitive } from '../domain/BillingDetails'
import { SubscriptionLimitExceededError } from '../domain/subscriptionErrors'

export interface CreateCheckoutSessionInput {
  planId: string
  period: BillingPeriod
  /** Usuarios adicionales al incluido en el plan (0 si no se añaden). */
  extraSeats: number
  userId: string
  /**
   * Organización que compra (identidad de facturación): identifica al
   * Customer de Stripe para comprobar el límite de una suscripción por
   * organización.
   */
  organizationId: string
  billingDetails: BillingDetailsPrimitive
  successUrl: string
  cancelUrl: string
}

/**
 * Errores de dominio del checkout. El entrypoint los traduce a códigos HTTP
 * (400/404/409) sin filtrar detalles internos al cliente.
 */
export class PlanNotFoundError extends Error {
  constructor(planId: string) {
    super(`Plan no encontrado: ${planId}`)
    this.name = 'PlanNotFoundError'
  }
}

export class PlanNotPurchasableError extends Error {
  constructor(planId: string, period: BillingPeriod) {
    super(`El plan ${planId} no es comprable en periodo ${period}`)
    this.name = 'PlanNotPurchasableError'
  }
}

export class InvalidSeatCountError extends Error {
  constructor(planId: string, extraSeats: number, maxExtraSeats: number) {
    super(`El plan ${planId} no admite ${extraSeats} usuarios extra (máximo ${maxExtraSeats})`)
    this.name = 'InvalidSeatCountError'
  }
}

/**
 * Crea una sesión de pago para suscribirse a un plan.
 *
 * Reglas de negocio (por eso vive en application y no en el endpoint):
 *  - la cuenta no debe tener ya una suscripción activa (máximo una por cuenta;
 *    para cambiar de plan se usa `ChangeSubscriptionPlan`, no un checkout nuevo),
 *  - el plan debe existir,
 *  - debe ser comprable (no a medida, con precio de Stripe configurado),
 *  - debe tener precio para el periodo solicitado,
 *  - los usuarios extra deben respetar el máximo del plan,
 *  - los datos de facturación deben ser válidos (value object BillingDetails).
 * Las líneas de cobro se construyen AQUÍ con los `price_...` del servidor:
 * nunca se acepta un precio calculado por el cliente.
 */
export class CreateCheckoutSession {
  constructor(
    private readonly planRepository: IPlanRepository,
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly checkoutGateway: ICheckoutGateway,
    /** `price_...` del asiento extra por periodo; `null` si no está configurado. */
    private readonly extraSeatPriceIds: Record<BillingPeriod, string | null>,
  ) {}

  async execute(input: CreateCheckoutSessionInput): Promise<CheckoutSession> {
    const existingSubscriptions = await this.subscriptionRepository.listByOrganization(
      input.organizationId,
    )
    const activeSubscription = existingSubscriptions.find((sub) => sub.isManageable)
    if (activeSubscription) {
      throw new SubscriptionLimitExceededError(activeSubscription.stripeSubscriptionId!)
    }

    const plans = await this.planRepository.getAll()
    const plan = plans.find((p) => p.id === input.planId)
    if (!plan) throw new PlanNotFoundError(input.planId)

    if (!plan.isPurchasable) throw new PlanNotPurchasableError(input.planId, input.period)

    const priceId = plan.stripePriceIdFor(input.period)
    if (!priceId) throw new PlanNotPurchasableError(input.planId, input.period)

    if (!plan.allowsExtraSeats(input.extraSeats)) {
      throw new InvalidSeatCountError(input.planId, input.extraSeats, plan.maxExtraSeats)
    }

    const lineItems: CheckoutLineItem[] = [{ priceId, quantity: 1 }]
    if (input.extraSeats > 0) {
      const extraSeatPriceId = this.extraSeatPriceIds[input.period]
      // Sin precio de asiento configurado no se puede cobrar los extras:
      // mejor rechazar la compra que cobrar de menos silenciosamente.
      if (!extraSeatPriceId) throw new PlanNotPurchasableError(input.planId, input.period)
      lineItems.push({ priceId: extraSeatPriceId, quantity: input.extraSeats })
    }

    // Valida y normaliza los datos fiscales; lanza InvalidBillingDetailsError.
    const billingDetails = BillingDetails.create(input.billingDetails)

    return this.checkoutGateway.createSubscriptionSession({
      lineItems,
      planId: plan.id,
      period: input.period,
      extraSeats: input.extraSeats,
      organizationId: input.organizationId,
      userId: input.userId,
      billingDetails,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
    })
  }
}
