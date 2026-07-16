import Stripe from 'stripe'
import type { ICardSetupGateway } from '../domain/ICardSetupGateway'

/**
 * Implementación del puerto de guardado de tarjeta con Stripe Checkout en
 * modo `setup`: sesión alojada donde el usuario introduce la tarjeta y Stripe
 * la guarda en el Customer, SIN cobrar nada. Mismo patrón que
 * `StripeCheckoutGateway` (página alojada por Stripe, PCI fuera de nuestro
 * lado), pero sin líneas de precio ni datos fiscales — el Customer ya existe.
 *
 * La clave secreta se inyecta por constructor (nunca se lee aquí de env): el
 * adapter no debe conocer el origen del secreto, solo usarlo.
 */
export class StripeCardSetupGateway implements ICardSetupGateway {
  private readonly stripe: Stripe

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey)
  }

  async createSetupSession(
    email: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ url: string }> {
    const customerId = await this.findOrCreateCustomer(email)

    const session = await this.stripe.checkout.sessions.create({
      mode: 'setup',
      customer: customerId,
      // No incluir payment_method_types: se deja que Stripe los resuelva dinámicamente.
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    if (!session.url) {
      throw new Error('Stripe no devolvió una URL de sesión de guardado de tarjeta')
    }

    return { url: session.url }
  }

  /**
   * Reutiliza el Customer del email si ya existe (mismo email que usan
   * suscripciones/facturas); si no, lo crea. A diferencia de
   * `StripeCheckoutGateway`, aquí NO se tocan datos fiscales: guardar una
   * tarjeta no es una compra, solo necesita un Customer al que asociarla.
   */
  private async findOrCreateCustomer(email: string): Promise<string> {
    const existing = await this.stripe.customers.list({ email, limit: 1 })
    if (existing.data[0]) return existing.data[0].id

    const customer = await this.stripe.customers.create({ email })
    return customer.id
  }
}
