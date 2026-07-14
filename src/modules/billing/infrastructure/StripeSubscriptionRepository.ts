import Stripe from 'stripe'
import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'
import { Subscription, type SubscriptionStatus } from '../domain/Subscription'
import type { IPlanRepository } from '../domain/IPlanRepository'
import type { Plan } from '../domain/Plan'

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
        this.stripe.subscriptions.list({ customer: customer.id, status: 'all', limit: 20 }),
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
        }),
      )
  }
}

/**
 * Resuelve nuestro planId: primero la metadata que copia el checkout a la
 * suscripción; si falta (alta manual en el dashboard), se busca qué plan tiene
 * configurado alguno de los `price_...` de la suscripción.
 */
function resolvePlanId(sub: Stripe.Subscription, plans: Plan[]): string {
  const fromMetadata = sub.metadata?.planId
  if (fromMetadata) return fromMetadata

  const priceIds = sub.items.data.map((item) => item.price?.id).filter(Boolean)
  const match = plans.find((plan) =>
    priceIds.some((id) => id === plan.stripePriceIdMonthly || id === plan.stripePriceIdYearly),
  )
  return match?.id ?? ''
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
  const periodEnd =
    sub.items?.data?.[0]?.current_period_end ??
    (sub as unknown as { current_period_end?: number }).current_period_end
  return periodEnd ? new Date(periodEnd * 1000).toISOString() : ''
}
