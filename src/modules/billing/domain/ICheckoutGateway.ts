import type { BillingPeriod } from './Plan'
import type { BillingDetails } from './BillingDetails'

/** Línea de cobro de la sesión: precio recurrente del proveedor + cantidad. */
export interface CheckoutLineItem {
  /** Identificador de precio recurrente del proveedor (Stripe: `price_...`). */
  priceId: string
  quantity: number
}

/**
 * Datos necesarios para abrir una sesión de pago de una suscripción.
 * El dominio no conoce el formato de los `priceId`, solo los transporta.
 */
export interface CheckoutRequest {
  /** Plan base ×1 y, si hay usuarios extra, el precio por asiento ×N. */
  lineItems: CheckoutLineItem[]
  planId: string
  period: BillingPeriod
  /** Usuarios adicionales al incluido, para reconciliar en el webhook. */
  extraSeats: number
  /** Identificador del usuario que compra, para asociar la suscripción. */
  userId: string
  /** Datos fiscales del comprador, ya validados (value object). */
  billingDetails: BillingDetails
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
