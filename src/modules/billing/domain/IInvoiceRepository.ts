import type { Invoice } from './Invoice'

export interface IInvoiceRepository {
  /**
   * Facturas emitidas a la organización indicada, más recientes primero. La
   * organización es la identidad de facturación: tiene un único Customer en
   * Stripe (`stripeCustomerId`, resuelto vía `resolveCustomerId`).
   */
  listByOrganization(organizationId: string): Promise<Invoice[]>
}
