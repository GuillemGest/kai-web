import type { BillingPeriod } from './Plan'

/**
 * Datos necesarios para abrir una sesión de pago de una suscripción.
 * `priceId` es el identificador de precio recurrente del proveedor (Stripe:
 * `price_...`); el dominio no conoce el formato, solo lo transporta.
 */
export interface CheckoutRequest {
  priceId: string
  period: BillingPeriod
  /** Identificador del usuario que compra, para asociar la suscripción. */
  userId: string
  /** Email del comprador; el proveedor lo usa para crear/enlazar el cliente. */
  customerEmail: string | null
  /** URL absoluta a la que volver tras un pago con éxito. */
  successUrl: string
  /** URL absoluta a la que volver si el usuario cancela el pago. */
  cancelUrl: string
}

/**
 * Sesión de pago creada por el proveedor. La UI solo necesita `url` para
 * redirigir al usuario a la pasarela alojada.
 */
export interface CheckoutSession {
  id: string
  url: string
}

/**
 * Puerto de salida hacia la pasarela de pago (Stripe u otra). La implementación
 * concreta vive en `infrastructure/`. Mantener este contrato agnóstico permite
 * testear el use case con un doble y cambiar de proveedor sin tocar aplicación.
 */
export interface ICheckoutGateway {
  createSubscriptionSession(request: CheckoutRequest): Promise<CheckoutSession>
}
