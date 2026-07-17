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
 *
 * TODO(billing-multi-org): los endpoints SSR todavía reciben `email` en vez
 * de `organizationId` y no verifican pertenencia a la organización (ver
 * docs/billing-multi-organizacion.md §6 y §7.1) — pendiente de actualizar
 * junto con `assertOrganizationAccess`. Este repo ya expone el contrato final
 * (`organizationId`) para que el dominio no dependa de ese paso.
 */
export class HttpSubscriptionRepository implements ISubscriptionRepository {
  async listByOrganization(organizationId: string): Promise<Subscription[]> {
    const res = await fetch(
      `/api/subscriptions?organizationId=${encodeURIComponent(organizationId)}`,
    )

    const data = (await res.json().catch(() => null)) as {
      subscriptions?: SubscriptionPrimitive[]
      error?: string
    } | null

    if (!res.ok || !data?.subscriptions) {
      throw new Error(data?.error ?? 'No se pudieron cargar las suscripciones.')
    }

    return data.subscriptions.map(Subscription.fromPrimitive)
  }

  async cancelAtPeriodEnd(organizationId: string, subscriptionId: string): Promise<void> {
    await this.post('/api/subscriptions/cancel', { organizationId, subscriptionId })
  }

  async reactivate(organizationId: string, subscriptionId: string): Promise<void> {
    await this.post('/api/subscriptions/reactivate', { organizationId, subscriptionId })
  }

  async changePlan(
    organizationId: string,
    subscriptionId: string,
    target: Plan,
    period: BillingPeriod,
    _timing: PlanChangeTiming,
  ): Promise<{ paymentUrl: string | null }> {
    const data = await this.postJson('/api/subscriptions/change-plan', {
      organizationId,
      subscriptionId,
      planId: target.id,
      period,
    })
    return { paymentUrl: data.paymentUrl ?? null }
  }

  private async post(url: string, body: Record<string, string>): Promise<void> {
    await this.postJson(url, body)
  }

  private async postJson(
    url: string,
    body: Record<string, string>,
  ): Promise<{ paymentUrl?: string | null; error?: string }> {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const data = (await res.json().catch(() => null)) as {
      paymentUrl?: string | null
      error?: string
    } | null
    if (!res.ok) {
      throw new Error(data?.error ?? 'No se pudo completar la operación.')
    }
    return data ?? {}
  }
}
