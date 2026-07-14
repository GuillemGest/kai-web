import Stripe from 'stripe'
import type {
  ICheckoutGateway,
  CheckoutRequest,
  CheckoutSession,
} from '../domain/ICheckoutGateway'
import type { BillingDetails } from '../domain/BillingDetails'

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
 * Datos fiscales: se pre-crea un Customer con razón social, dirección y NIF para
 * que las facturas de Stripe salgan con los datos correctos. El formulario propio
 * del wizard es la fuente de esos datos, así que NO se usa `tax_id_collection` ni
 * `billing_address_collection` (duplicarían la petición en la página alojada).
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
    const customerId = await this.findOrCreateCustomer(request.userId, request.billingDetails)

    // Metadata aplanada: es lo que consumirán el webhook y el backoffice para
    // reconciliar la compra y emitir factura (límite Stripe: 500 chars/valor).
    const metadata: Record<string, string> = {
      userId: request.userId,
      planId: request.planId,
      period: request.period,
      extraSeats: String(request.extraSeats),
      billingLegalName: request.billingDetails.legalName,
      billingTaxId: request.billingDetails.taxId,
      billingEmail: request.billingDetails.billingEmail,
      billingAddressLine: request.billingDetails.addressLine,
      billingCity: request.billingDetails.city,
      billingPostalCode: request.billingDetails.postalCode,
      billingProvince: request.billingDetails.province,
      billingCountry: request.billingDetails.country,
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      // No incluir payment_method_types: se deja que Stripe los resuelva dinámicamente.
      line_items: request.lineItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity,
      })),
      // Permite reconciliar el pago con nuestro usuario en el webhook.
      client_reference_id: request.userId,
      // Customer con los datos fiscales del wizard (excluyente con customer_email).
      customer: customerId,
      metadata,
      subscription_data: { metadata },
      success_url: request.successUrl,
      cancel_url: request.cancelUrl,
    })

    if (!session.url) {
      throw new Error('Stripe no devolvió una URL de checkout')
    }

    return { id: session.id, url: session.url }
  }

  /**
   * Reutiliza el Customer del email de facturación si ya existe (evita duplicar
   * clientes en reintentos/cancelaciones) y refresca sus datos fiscales; si no,
   * lo crea. El NIF se registra best-effort: Stripe valida el checksum y un tax
   * id que rechace no debe bloquear la compra (queda igualmente en metadata).
   */
  private async findOrCreateCustomer(userId: string, billing: BillingDetails): Promise<string> {
    const fiscalData = {
      name: billing.legalName,
      email: billing.billingEmail,
      address: {
        line1: billing.addressLine,
        city: billing.city,
        postal_code: billing.postalCode,
        state: billing.province,
        country: billing.country,
      },
      metadata: { userId },
    }

    // `tax_ids` no viene en la respuesta por defecto: se expande para poder
    // comprobar si el NIF ya está registrado sin una llamada extra.
    const expand = ['tax_ids']
    const existing = await this.stripe.customers.list({ email: billing.billingEmail, limit: 1 })
    const customer = existing.data[0]
      ? await this.stripe.customers.update(existing.data[0].id, { ...fiscalData, expand })
      : await this.stripe.customers.create({ ...fiscalData, expand })

    try {
      const alreadyRegistered = customer.tax_ids?.data?.some((t) => t.value === billing.taxId)
      if (!alreadyRegistered) {
        await this.stripe.customers.createTaxId(customer.id, {
          // `eu_vat` cubre NIF/CIF intracomunitarios; para España Stripe acepta
          // también `es_cif`. Se intenta el específico y no se bloquea si falla.
          type: billing.country === 'ES' ? 'es_cif' : 'eu_vat',
          value: billing.taxId,
        })
      }
    } catch (error) {
      console.warn('[stripe] tax id no registrado en el Customer (sigue en metadata):', error)
    }

    return customer.id
  }
}
