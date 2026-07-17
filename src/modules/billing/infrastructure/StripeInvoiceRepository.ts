import Stripe from 'stripe'
import type { IInvoiceRepository } from '../domain/IInvoiceRepository'
import { Invoice, type InvoicePrimitive, type InvoiceStatus } from '../domain/Invoice'
import type { IOrganizationBillingRepository } from '../domain/IOrganizationBillingRepository'
import { resolveCustomerId } from './resolveCustomerId'

/**
 * Facturas reales desde Stripe. SOLO servidor: instancia el SDK con la clave
 * secreta (inyectada por constructor, como StripeCheckoutGateway), así que debe
 * usarse únicamente detrás de endpoints SSR (`src/pages/api/*`) vía
 * `invoicesFactory`, nunca desde el bundle del navegador.
 *
 * La búsqueda es por `stripeCustomerId` de la organización porque es la
 * identidad de facturación: un único Customer por organización, resuelto vía
 * `resolveCustomerId`.
 */
export class StripeInvoiceRepository implements IInvoiceRepository {
  private readonly stripe: Stripe

  constructor(
    secretKey: string,
    private readonly organizationBillingRepository: IOrganizationBillingRepository,
  ) {
    this.stripe = new Stripe(secretKey)
  }

  async listByOrganization(organizationId: string): Promise<Invoice[]> {
    const customerId = await resolveCustomerId(
      this.stripe,
      this.organizationBillingRepository,
      organizationId,
    )
    const page = await this.stripe.invoices.list({ customer: customerId, limit: 20 })

    return page.data
      .map((invoice) => toPrimitive(invoice))
      .filter((primitive): primitive is InvoicePrimitive => primitive !== null)
      .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
      .map(Invoice.fromPrimitive)
  }
}

/**
 * Mapea el estado de Stripe al del dominio. Los borradores (`draft`) devuelven
 * `null` y se excluyen del listado: aún no son facturas emitidas.
 */
function mapStatus(status: Stripe.Invoice.Status | null): InvoiceStatus | null {
  switch (status) {
    case 'paid':
      return 'paid'
    case 'open':
      return 'open'
    case 'void':
      return 'void'
    case 'uncollectible':
      return 'uncollectible'
    default:
      return null
  }
}

function toPrimitive(invoice: Stripe.Invoice): InvoicePrimitive | null {
  const status = mapStatus(invoice.status)
  if (!status) return null
  return {
    id: invoice.id ?? '',
    // El userId viaja en la metadata que el checkout copia a la suscripción y
    // de ahí a sus facturas; si falta (p. ej. factura manual), queda vacío.
    userId: invoice.metadata?.userId ?? '',
    number: invoice.number ?? invoice.id ?? '',
    amount: invoice.amount_paid || invoice.amount_due,
    currency: invoice.currency.toUpperCase(),
    status,
    issuedAt: new Date(invoice.created * 1000).toISOString(),
    description: invoice.lines?.data?.[0]?.description ?? '',
    // El PDF descargable es lo primero; la página alojada, el fallback.
    pdfUrl: invoice.invoice_pdf ?? invoice.hosted_invoice_url ?? null,
  }
}
