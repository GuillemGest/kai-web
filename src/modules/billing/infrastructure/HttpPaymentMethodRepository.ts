import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'
import { PaymentMethod, type PaymentMethodPrimitive } from '../domain/PaymentMethod'

/**
 * Implementación de CLIENTE del repositorio de métodos de pago: delega en los
 * endpoints SSR `/api/payment-methods*`, que son quienes hablan con Stripe
 * usando la clave secreta (mismo patrón que HttpSubscriptionRepository).
 */
export class HttpPaymentMethodRepository implements IPaymentMethodRepository {
  async listByEmail(email: string): Promise<PaymentMethod[]> {
    const res = await fetch(`/api/payment-methods?email=${encodeURIComponent(email)}`)

    const data = (await res.json().catch(() => null)) as {
      paymentMethods?: PaymentMethodPrimitive[]
      error?: string
    } | null

    if (!res.ok || !data?.paymentMethods) {
      throw new Error(data?.error ?? 'No se pudieron cargar los métodos de pago.')
    }

    return data.paymentMethods.map(PaymentMethod.fromPrimitive)
  }

  async setDefault(email: string, paymentMethodId: string): Promise<void> {
    const res = await fetch('/api/payment-methods/set-default', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, paymentMethodId }),
    })
    if (!res.ok) {
      const data = (await res.json().catch(() => null)) as { error?: string } | null
      throw new Error(data?.error ?? 'No se pudo actualizar la tarjeta predeterminada.')
    }
  }
}
