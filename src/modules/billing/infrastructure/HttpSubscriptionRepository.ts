import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'
import { Subscription, type SubscriptionPrimitive } from '../domain/Subscription'
import type { BillingPeriod, Plan, PlanChangeTiming } from '../domain/Plan'

/**
 * Implementación de CLIENTE del repositorio de suscripciones: delega en los
 * endpoints SSR `/api/subscriptions*`, que son quienes hablan con Stripe usando
 * la clave secreta (mismo patrón que HttpInvoiceRepository).
 *
 * Nota sobre `changePlan`: el `timing` que recibe NO se envía al servidor. El
 * endpoint vuelve a ejecutar el use case con los datos reales de Stripe y
 * recalcula el timing él mismo — un cliente manipulado no puede forzar un
 * downgrade inmediato ni esquivar el prorrateo.
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

  async cancelAtPeriodEnd(email: string, subscriptionId: string): Promise<void> {
    await this.post('/api/subscriptions/cancel', { email, subscriptionId })
  }

  async reactivate(email: string, subscriptionId: string): Promise<void> {
    await this.post('/api/subscriptions/reactivate', { email, subscriptionId })
  }

  async changePlan(
    email: string,
    subscriptionId: string,
    target: Plan,
    period: BillingPeriod,
    _timing: PlanChangeTiming,
  ): Promise<void> {
    await this.post('/api/subscriptions/change-plan', {
      email,
      subscriptionId,
      planId: target.id,
      period,
    })
  }

  private async post(url: string, body: Record<string, string>): Promise<void> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      throw new Error(data?.error ?? 'No se pudo completar la operación.')
    }
  }
}
