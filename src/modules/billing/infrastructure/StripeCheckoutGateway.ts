import Stripe from 'stripe'
import type {
  ICheckoutGateway,
  CheckoutRequest,
  CheckoutSession,
} from '../domain/ICheckoutGateway'

/**
 * Implementación del puerto de checkout con Stripe Billing + Checkout Sessions.
 *
 * Sigue las buenas prácticas oficiales de Stripe para suscripciones:
 *  - `mode: 'subscription'` (renovación, reintentos y dunning gestionados por Stripe),
 *  - NO se pasa `payment_method_types`: Stripe decide dinámicamente los métodos de
 *    pago elegibles según la configuración del Dashboard (mejor conversión),
 *  - `client_reference_id` + `metadata` transportan el `userId`/`planId` para que
 *    el webhook pueda asociar la suscripción al usuario tras el pago.
 *
 * La clave secreta se inyecta por constructor (nunca se lee aquí de env): el
 * adapter no debe conocer el origen del secreto, solo usarlo.
 */
export class StripeCheckoutGateway implements ICheckoutGateway {
  private readonly stripe: Stripe

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey)
  }

  async createSubscriptionSession(request: CheckoutRequest): Promise<CheckoutSession> {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      // No incluir payment_method_types: se deja que Stripe los resuelva dinámicamente.
      line_items: [{ price: request.priceId, quantity: 1 }],
      // Permite reconciliar el pago con nuestro usuario en el webhook.
      client_reference_id: request.userId,
      customer_email: request.customerEmail ?? undefined,
      metadata: { userId: request.userId, period: request.period },
      subscription_data: {
        metadata: { userId: request.userId, period: request.period },
      },
      success_url: request.successUrl,
      cancel_url: request.cancelUrl,
    })

    if (!session.url) {
      throw new Error('Stripe no devolvió una URL de checkout')
    }

    return { id: session.id, url: session.url }
  }
}
