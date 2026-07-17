import Stripe from 'stripe'
import type {
  ICheckoutGateway,
  CheckoutRequest,
  CheckoutSession,
} from '../domain/ICheckoutGateway'
import type { BillingDetails } from '../domain/BillingDetails'
import type { IOrganizationBillingRepository } from '../domain/IOrganizationBillingRepository'
import { resolveCustomerId } from './resolveCustomerId'

/**
 * Implementación del puerto de checkout con Stripe Billing + Checkout Sessions.
 *
 * Sigue las buenas prácticas oficiales de Stripe para suscripciones:
 *  - `mode: 'subscription'` (renovación, reintentos y dunning gestionados por Stripe),
 *  - NO se pasa `payment_method_types`: Stripe decide dinámicamente los métodos de
 *    pago elegibles según la configuración del Dashboard (mejor conversión),
 *  - `client_reference_id` + `metadata` transportan el `userId`/`organizationId`/
 *    `planId` para que el webhook pueda asociar la suscripción tras el pago.
 *
 * Datos fiscales: se refresca el Customer de la organización con nombre,
 * dirección y (en company) NIF para que las facturas de Stripe salgan con los
 * datos correctos. El formulario propio del wizard es la fuente de esos datos,
 * así que NO se usa `tax_id_collection` ni `billing_address_collection`.
 *
 * La clave secreta se inyecta por constructor (nunca se lee aquí de env): el
 * adapter no debe conocer el origen del secreto, solo usarlo.
 */
export class StripeCheckoutGateway implements ICheckoutGateway {
  private readonly stripe: Stripe

  constructor(
    secretKey: string,
    private readonly organizationBillingRepository: IOrganizationBillingRepository,
  ) {
    this.stripe = new Stripe(secretKey)
  }

  async createSubscriptionSession(request: CheckoutRequest): Promise<CheckoutSession> {
    const customerId = await this.findOrCreateCustomer(
      request.organizationId,
      request.billingDetails,
    )

    // Metadata aplanada: es lo que consumirán el webhook y el backoffice para
    // reconciliar la compra y emitir factura (límite Stripe: 500 chars/valor).
    // Solo se incluyen los campos aplicables al `customerType`; los del otro
    // modo se omiten para no persistir cadenas vacías.
    const billing = request.billingDetails
    const metadata: Record<string, string> = {
      organizationId: request.organizationId,
      userId: request.userId,
      planId: request.planId,
      period: request.period,
      extraSeats: String(request.extraSeats),
      billingCustomerType: billing.customerType,
      billingEmail: billing.billingEmail,
      billingPostalCode: billing.postalCode,
      billingCountry: billing.country,
    }
    if (billing.isCompany) {
      metadata.billingLegalName = billing.legalName
      metadata.billingTaxId = billing.taxId
      metadata.billingAddressLine = billing.addressLine
      metadata.billingCity = billing.city
      metadata.billingProvince = billing.province
    } else {
      metadata.billingFullName = billing.fullName
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
      // Customer de la organización, con datos fiscales del wizard ya aplicados.
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
   * Resuelve el Customer de la organización (`resolveCustomerId` centraliza la
   * lookup por metadata + creación bajo lock) y le aplica los datos fiscales
   * del wizard. En company registra el NIF best-effort; en personal se omiten
   * los campos que el usuario no ha aportado y se limpian los tax ids
   * heredados de una compra company anterior para que la factura no lleve NIF.
   */
  private async findOrCreateCustomer(
    organizationId: string,
    billing: BillingDetails,
  ): Promise<string> {
    const customerId = await resolveCustomerId(
      this.stripe,
      this.organizationBillingRepository,
      organizationId,
    )

    // Address: solo se envían los campos con valor. Stripe acepta direcciones
    // parciales (personal aporta solo postal_code + country).
    const address: Stripe.AddressParam = {
      country: billing.country,
      postal_code: billing.postalCode,
    }
    if (billing.addressLine) address.line1 = billing.addressLine
    if (billing.city) address.city = billing.city
    if (billing.province) address.state = billing.province

    const fiscalData: Stripe.CustomerUpdateParams = {
      name: billing.displayName,
      email: billing.billingEmail,
      address,
      metadata: { organizationId },
    }

    // `tax_ids` no viene en la respuesta por defecto: se expande para poder
    // comprobar si el NIF ya está registrado sin una llamada extra.
    const customer = await this.stripe.customers.update(customerId, {
      ...fiscalData,
      expand: ['tax_ids'],
    })

    if (billing.isCompany && billing.taxId) {
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
    } else {
      // Personal: purga cualquier NIF heredado de una compra company previa
      // sobre esta misma organización para que las próximas facturas no lo lleven.
      const existingTaxIds = customer.tax_ids?.data ?? []
      for (const taxId of existingTaxIds) {
        try {
          await this.stripe.customers.deleteTaxId(customer.id, taxId.id)
        } catch (error) {
          console.warn('[stripe] tax id no eliminado del Customer:', error)
        }
      }
    }

    return customer.id
  }
}
