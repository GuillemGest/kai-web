import type { IPlanRepository } from '../domain/IPlanRepository'
import type { ICheckoutGateway, CheckoutSession } from '../domain/ICheckoutGateway'
import type { BillingPeriod } from '../domain/Plan'

export interface CreateCheckoutSessionInput {
  planId: string
  period: BillingPeriod
  userId: string
  customerEmail: string | null
  successUrl: string
  cancelUrl: string
}

/**
 * Errores de dominio del checkout. El entrypoint los traduce a códigos HTTP
 * (404/409) sin filtrar detalles internos al cliente.
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

/**
 * Crea una sesión de pago para suscribirse a un plan.
 *
 * Reglas de negocio (por eso vive en application y no en el endpoint):
 *  - el plan debe existir,
 *  - debe ser comprable (no a medida, con precio de Stripe configurado),
 *  - y debe tener precio para el periodo solicitado.
 * Solo entonces se delega en la pasarela de pago.
 */
export class CreateCheckoutSession {
  constructor(
    private readonly planRepository: IPlanRepository,
    private readonly checkoutGateway: ICheckoutGateway,
  ) {}

  async execute(input: CreateCheckoutSessionInput): Promise<CheckoutSession> {
    const plans = await this.planRepository.getAll()
    const plan = plans.find((p) => p.id === input.planId)
    if (!plan) throw new PlanNotFoundError(input.planId)

    if (!plan.isPurchasable) throw new PlanNotPurchasableError(input.planId, input.period)

    const priceId = plan.stripePriceIdFor(input.period)
    if (!priceId) throw new PlanNotPurchasableError(input.planId, input.period)

    return this.checkoutGateway.createSubscriptionSession({
      priceId,
      period: input.period,
      userId: input.userId,
      customerEmail: input.customerEmail,
      successUrl: input.successUrl,
      cancelUrl: input.cancelUrl,
    })
  }
}
