import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'
import { PaymentMethod, type PaymentMethodPrimitive } from '../domain/PaymentMethod'

/**
 * Implementación de CLIENTE del repositorio de métodos de pago: delega en los
 * endpoints SSR `/api/payment-methods*`, que son quienes hablan con Stripe
 * usando la clave secreta (mismo patrón que HttpSubscriptionRepository).
 *
 * TODO(billing-multi-org): los endpoints SSR todavía reciben `email` en vez
 * de `organizationId` y no verifican pertenencia a la organización (ver
 * docs/billing-multi-organizacion.md §6 y §7.1) — pendiente de actualizar
 * junto con `assertOrganizationAccess`. Este repo ya expone el contrato final
 * (`organizationId`) para que el dominio no dependa de ese paso.
 */
export class HttpPaymentMethodRepository implements IPaymentMethodRepository {
  async listByOrganization(organizationId: string): Promise<PaymentMethod[]> {
    const res = await fetch(
      `/api/payment-methods?organizationId=${encodeURIComponent(organizationId)}`,
    )

    const data = (await res.json().catch(() => null)) as {
      paymentMethods?: PaymentMethodPrimitive[]
      error?: string
    } | null

    if (!res.ok || !data?.paymentMethods) {
      throw new Error(data?.error ?? 'No se pudieron cargar los métodos de pago.')
    }

    return data.paymentMethods.map(PaymentMethod.fromPrimitive)
  }

  async setDefault(organizationId: string, paymentMethodId: string): Promise<void> {
    const res = await fetch('/api/payment-methods/set-default', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId, paymentMethodId }),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      throw new Error(data?.error ?? 'No se pudo actualizar la tarjeta predeterminada.')
    }
  }

  async remove(organizationId: string, paymentMethodId: string): Promise<void> {
    const res = await fetch('/api/payment-methods/remove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId, paymentMethodId }),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      throw new Error(data?.error ?? 'No se pudo eliminar la tarjeta.')
    }
  }
}
