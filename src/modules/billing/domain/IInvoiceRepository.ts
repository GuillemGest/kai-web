import type { Invoice } from './Invoice'

export interface IInvoiceRepository {
  /**
   * Facturas emitidas al email indicado, más recientes primero. El email es la
   * identidad de facturación: es la clave del Customer en Stripe (el checkout
   * crea/reutiliza el Customer por email de facturación).
   */
  listByEmail(email: string): Promise<Invoice[]>
}
