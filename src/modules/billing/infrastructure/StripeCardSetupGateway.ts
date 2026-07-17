import Stripe from 'stripe'
import type { ICardSetupGateway } from '../domain/ICardSetupGateway'
import type { IOrganizationBillingRepository } from '../domain/IOrganizationBillingRepository'
import { resolveCustomerId } from './resolveCustomerId'

/**
 * Implementación del puerto de guardado de tarjeta con Stripe Checkout en
 * modo `setup`: sesión alojada donde el usuario introduce la tarjeta y Stripe
 * la guarda en el Customer, SIN cobrar nada. Mismo patrón que
 * `StripeCheckoutGateway` (página alojada por Stripe, PCI fuera de nuestro
 * lado), pero sin líneas de precio ni datos fiscales — el Customer ya existe
 * o se crea vía `resolveCustomerId`.
 *
 * La clave secreta se inyecta por constructor (nunca se lee aquí de env): el
 * adapter no debe conocer el origen del secreto, solo usarlo.
 */
export class StripeCardSetupGateway implements ICardSetupGateway {
  private readonly stripe: Stripe

  constructor(
    secretKey: string,
    private readonly organizationBillingRepository: IOrganizationBillingRepository,
  ) {
    this.stripe = new Stripe(secretKey)
  }

  async createSetupSession(
    organizationId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ url: string }> {
    const customerId = await resolveCustomerId(
      this.stripe,
      this.organizationBillingRepository,
      organizationId,
    )

    const session = await this.stripe.checkout.sessions.create({
      mode: 'setup',
      customer: customerId,
      // No incluir payment_method_types: se deja que Stripe los resuelva
      // dinámicamente. A cambio, en modo `setup` (a diferencia de `payment`/
      // `subscription`) Stripe exige `currency` explícita para poder resolver
      // qué métodos son compatibles sin esa lista fija. Única moneda del
      // proyecto (ver planes en InMemoryPlanRepository).
      currency: 'eur',
      success_url: successUrl,
      cancel_url: cancelUrl,
    })

    if (!session.url) {
      throw new Error('Stripe no devolvió una URL de sesión de guardado de tarjeta')
    }

    return { url: session.url }
  }
}
