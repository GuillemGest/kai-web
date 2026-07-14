import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'
import { Subscription, type SubscriptionPrimitive } from '../domain/Subscription'

/**
 * Implementación de CLIENTE del repositorio de suscripciones: delega en el
 * endpoint SSR `/api/subscriptions`, que es quien habla con Stripe usando la
 * clave secreta (mismo patrón que HttpInvoiceRepository).
 */
export class HttpSubscriptionRepository implements ISubscriptionRepository {
  async listByEmail(email: string): Promise<Subscription[]> {
    const res = await fetch(`/api/subscriptions?email=${encodeURIComponent(email)}`)

    const data = (await res.json().catch(() => null)) as {
      subscriptions?: SubscriptionPrimitive[]
      error?: string
    } | null

    if (!res.ok || !data?.subscriptions) {
      throw new Error(data?.error ?? 'No se pudieron cargar las suscripciones.')
    }

    return data.subscriptions.map(Subscription.fromPrimitive)
  }
}
