import Stripe from 'stripe'
import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'
import { Subscription, type SubscriptionStatus } from '../domain/Subscription'
import type { IPlanRepository } from '../domain/IPlanRepository'
import type { BillingPeriod, Plan, PlanChangeTiming } from '../domain/Plan'
import {
  SeatLimitExceededError,
  SubscriptionNotFoundError,
  SubscriptionNotManageableError,
} from '../domain/subscriptionErrors'

/**
 * Suscripciones desde Stripe. SOLO servidor: instancia el SDK con la clave
 * secreta (inyectada por constructor), así que debe usarse únicamente detrás
 * de endpoints SSR (`src/pages/api/*`) vía `subscriptionFactory`.
 *
 * La búsqueda es por email (identidad de facturación, igual que las facturas)
 * y devuelve TODAS las suscripciones del usuario — puede tener varios planes a
 * la vez — agregando las de todos los Customers con ese email, ordenadas por
 * relevancia (activas > con impago > canceladas) y, a igualdad, más recientes
 * primero.
 *
 * Las operaciones de gestión (cancelar, reactivar, cambiar de plan) verifican
 * SIEMPRE la titularidad: la suscripción debe pertenecer a un Customer con el
 * email indicado; si no, SubscriptionNotFoundError (misma respuesta exista o
 * no, para no revelar suscripciones ajenas).
 */
export class StripeSubscriptionRepository implements ISubscriptionRepository {
  private readonly stripe: Stripe

  constructor(
    secretKey: string,
    /** Para resolver el planId propio a partir del price de Stripe. */
    private readonly planRepository: IPlanRepository,
  ) {
    this.stripe = new Stripe(secretKey)
  }

  async listByEmail(email: string): Promise<Subscription[]> {
    const customers = await this.stripe.customers.list({ email, limit: 10 })
    if (customers.data.length === 0) return []

    const subscriptionsPerCustomer = await Promise.all(
      customers.data.map((customer) =>
        this.stripe.subscriptions.list({
          customer: customer.id,
          status: 'all',
          limit: 20,
          // El schedule expandido permite detectar downgrades programados sin
          // una llamada extra por suscripción.
          expand: ['data.schedule'],
        }),
      ),
    )

    // El catálogo de planes se carga una vez para mapear price → planId.
    const plans = await this.planRepository.getAll()

    return subscriptionsPerCustomer
      .flatMap((page) => page.data)
      .map((sub) => ({ sub, status: mapStatus(sub.status) }))
      .filter((c): c is { sub: Stripe.Subscription; status: SubscriptionStatus } =>
        c.status !== null,
      )
      .sort((a, b) => {
        const byRelevance = STATUS_RELEVANCE[a.status] - STATUS_RELEVANCE[b.status]
        return byRelevance !== 0 ? byRelevance : b.sub.created - a.sub.created
      })
      .map(({ sub, status }) =>
        Subscription.fromPrimitive({
          id: sub.id,
          userId: sub.metadata?.userId ?? '',
          planId: resolvePlanId(sub, plans),
          status,
          currentPeriodEnd: currentPeriodEndOf(sub),
          stripeSubscriptionId: sub.id,
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          pendingPlanId: resolvePendingPlanId(sub, plans),
        }),
      )
  }

  async cancelAtPeriodEnd(email: string, subscriptionId: string): Promise<void> {
    const sub = await this.findOwnedSubscription(email, subscriptionId)
    if (!isManageableStatus(sub.status)) throw new SubscriptionNotManageableError(subscriptionId)

    // Un downgrade programado ya no tiene sentido si el usuario se da de baja:
    // se libera el schedule antes de programar la cancelación.
    await this.releaseScheduleIfAny(sub)
    await this.stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true })
  }

  async reactivate(email: string, subscriptionId: string): Promise<void> {
    const sub = await this.findOwnedSubscription(email, subscriptionId)
    if (!isManageableStatus(sub.status)) throw new SubscriptionNotManageableError(subscriptionId)

    await this.stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: false })
  }

  async changePlan(
    email: string,
    subscriptionId: string,
    target: Plan,
    period: BillingPeriod,
    timing: PlanChangeTiming,
  ): Promise<{ paymentUrl: string | null }> {
    const sub = await this.findOwnedSubscription(email, subscriptionId)
    if (!isManageableStatus(sub.status)) throw new SubscriptionNotManageableError(subscriptionId)

    const priceId = target.stripePriceIdFor(period)
    if (!priceId) {
      throw new Error(`El plan ${target.id} no tiene price de Stripe para el periodo ${period}`)
    }

    // Distinguimos la línea del plan de las líneas de usuarios extra: la del
    // plan es la que casa con algún price del catálogo.
    const plans = await this.planRepository.getAll()
    const planItem = sub.items.data.find((item) => planIdForPriceIds([item.price?.id], plans))
    if (!planItem) throw new SubscriptionNotManageableError(subscriptionId)
    const seatItems = sub.items.data.filter((item) => item.id !== planItem.id)

    // Los asientos contratados deben caber en el plan de destino.
    const extraSeats = seatItems.reduce((total, item) => total + (item.quantity ?? 0), 0)
    if (!target.allowsExtraSeats(extraSeats)) throw new SeatLimitExceededError(target.id)

    if (timing === 'now_prorated') {
      // Upgrade: el item se actualiza ya, pero el cargo de la diferencia
      // prorrateada NO se cobra en caliente contra la tarjeta guardada.
      // `default_incomplete` deja la factura en `open` y expone su página
      // alojada (`hosted_invoice_url`): ahí el usuario confirma el pago y
      // puede cambiar de tarjeta, en vez de que Stripe cobre a ciegas. Si
      // había un downgrade programado o una baja pendiente, cambiar de plan
      // implica continuar: se limpian.
      await this.releaseScheduleIfAny(sub)
      const updated = await this.stripe.subscriptions.update(subscriptionId, {
        items: [{ id: planItem.id, price: priceId }],
        proration_behavior: 'always_invoice',
        payment_behavior: 'default_incomplete',
        cancel_at_period_end: false,
        metadata: { ...sub.metadata, planId: target.id },
        expand: ['latest_invoice'],
      })
      const invoice = typeof updated.latest_invoice === 'object' ? updated.latest_invoice : null
      // Sin importe pendiente (p. ej. crédito de saldo cubre la diferencia)
      // Stripe no deja factura por pagar: no hace falta redirigir a nada.
      const paymentUrl =
        invoice && invoice.status === 'open' ? (invoice.hosted_invoice_url ?? null) : null
      return { paymentUrl }
    }

    // Downgrade: el plan actual (ya pagado) se mantiene hasta fin de periodo y
    // el nuevo entra en la siguiente renovación, sin cobros ni abonos ahora.
    // Se modela con un Subscription Schedule de dos fases.
    if (sub.cancel_at_period_end) {
      await this.stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: false })
    }
    const schedule = await this.findOrCreateSchedule(sub)
    const currentPhase = schedule.phases[0]
    const carriedSeats = seatItems.map((item) => ({
      price: item.price.id,
      quantity: item.quantity ?? 1,
    }))
    await this.stripe.subscriptionSchedules.update(schedule.id, {
      phases: [
        {
          items: sub.items.data.map((item) => ({
            price: item.price.id,
            quantity: item.quantity ?? 1,
          })),
          start_date: currentPhase.start_date,
          end_date: currentPeriodEndUnix(sub),
        },
        {
          items: [{ price: priceId, quantity: 1 }, ...carriedSeats],
          proration_behavior: 'none',
          // Al entrar la fase, Stripe vuelca esta metadata a la suscripción:
          // así `resolvePlanId` seguirá siendo correcto tras la renovación.
          metadata: { ...sub.metadata, planId: target.id },
        },
      ],
      // Tras la última fase el schedule se libera y la suscripción sigue
      // renovándose sola con el plan nuevo.
      end_behavior: 'release',
    })
    return { paymentUrl: null }
  }

  /**
   * Recupera la suscripción verificando que pertenece al email indicado. La
   * comparación es contra el email del Customer (identidad de facturación).
   */
  private async findOwnedSubscription(
    email: string,
    subscriptionId: string,
  ): Promise<Stripe.Subscription> {
    let sub: Stripe.Subscription
    try {
      sub = await this.stripe.subscriptions.retrieve(subscriptionId, { expand: ['customer'] })
    } catch {
      throw new SubscriptionNotFoundError(subscriptionId)
    }

    const customer = sub.customer as Stripe.Customer | Stripe.DeletedCustomer
    const ownerEmail = 'email' in customer ? customer.email : null
    if (!ownerEmail || ownerEmail.toLowerCase() !== email.toLowerCase()) {
      throw new SubscriptionNotFoundError(subscriptionId)
    }
    return sub
  }

  /** Libera (sin cancelar la suscripción) el schedule asociado, si existe. */
  private async releaseScheduleIfAny(sub: Stripe.Subscription): Promise<void> {
    const scheduleId = typeof sub.schedule === 'string' ? sub.schedule : sub.schedule?.id
    if (!scheduleId) return
    const schedule = await this.stripe.subscriptionSchedules.retrieve(scheduleId)
    if (schedule.status === 'active' || schedule.status === 'not_started') {
      await this.stripe.subscriptionSchedules.release(scheduleId)
    }
  }

  /** Schedule ya asociado a la suscripción, o uno nuevo creado a partir de ella. */
  private async findOrCreateSchedule(
    sub: Stripe.Subscription,
  ): Promise<Stripe.SubscriptionSchedule> {
    const scheduleId = typeof sub.schedule === 'string' ? sub.schedule : sub.schedule?.id
    if (scheduleId) {
      const existing = await this.stripe.subscriptionSchedules.retrieve(scheduleId)
      if (existing.status === 'active' || existing.status === 'not_started') return existing
    }
    return this.stripe.subscriptionSchedules.create({ from_subscription: sub.id })
  }
}

/** Estados de Stripe sobre los que tiene sentido operar (cancelar/cambiar). */
function isManageableStatus(status: Stripe.Subscription.Status): boolean {
  return status === 'active' || status === 'trialing' || status === 'past_due'
}

/** planId del catálogo cuyo price mensual o anual esté entre los indicados, o null. */
function planIdForPriceIds(
  priceIds: readonly (string | undefined)[],
  plans: Plan[],
): string | null {
  const match = plans.find((plan) =>
    priceIds.some(
      (id) => id && (id === plan.stripePriceIdMonthly || id === plan.stripePriceIdYearly),
    ),
  )
  return match?.id ?? null
}

/**
 * Resuelve nuestro planId: primero la metadata que copia el checkout a la
 * suscripción; si falta (alta manual en el dashboard), se busca qué plan tiene
 * configurado alguno de los `price_...` de la suscripción.
 */
function resolvePlanId(sub: Stripe.Subscription, plans: Plan[]): string {
  const fromMetadata = sub.metadata?.planId
  if (fromMetadata) return fromMetadata

  const priceIds = sub.items.data.map((item) => item.price?.id)
  return planIdForPriceIds(priceIds, plans) ?? ''
}

/**
 * Downgrade programado: si la suscripción tiene un schedule activo cuya última
 * fase apunta a un plan distinto del actual, ese es el plan pendiente.
 */
function resolvePendingPlanId(sub: Stripe.Subscription, plans: Plan[]): string | null {
  const schedule = typeof sub.schedule === 'object' ? sub.schedule : null
  if (!schedule || schedule.status !== 'active' || schedule.phases.length < 2) return null

  const lastPhase = schedule.phases[schedule.phases.length - 1]
  const priceIds = lastPhase.items.map((item) =>
    typeof item.price === 'string' ? item.price : item.price?.id,
  )
  const pending = planIdForPriceIds(priceIds, plans)
  return pending && pending !== resolvePlanId(sub, plans) ? pending : null
}

/** Menor = más relevante al listar suscripciones. */
const STATUS_RELEVANCE: Record<SubscriptionStatus, number> = {
  active: 0,
  past_due: 1,
  canceled: 2,
  none: 3,
}

/**
 * Mapea el estado de Stripe al del dominio. Los `incomplete` (checkout nunca
 * terminado) devuelven `null` y se descartan: no llegaron a ser suscripción.
 */
function mapStatus(status: Stripe.Subscription.Status): SubscriptionStatus | null {
  switch (status) {
    case 'active':
    case 'trialing':
      return 'active'
    case 'past_due':
    case 'unpaid':
      return 'past_due'
    case 'canceled':
    case 'paused':
      return 'canceled'
    default:
      // incomplete / incomplete_expired
      return null
  }
}

/**
 * Fin del periodo actual en ISO. En las versiones recientes del API de Stripe
 * `current_period_end` vive en cada item de la suscripción (todas las líneas
 * comparten intervalo en nuestro caso: plan + asientos van al mismo ciclo).
 */
function currentPeriodEndOf(sub: Stripe.Subscription): string {
  const periodEnd = currentPeriodEndUnix(sub)
  return periodEnd ? new Date(periodEnd * 1000).toISOString() : ''
}

/** Fin del periodo actual en epoch (segundos), como lo espera el API de Stripe. */
function currentPeriodEndUnix(sub: Stripe.Subscription): number | undefined {
  return (
    sub.items?.data?.[0]?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end
  )
}
