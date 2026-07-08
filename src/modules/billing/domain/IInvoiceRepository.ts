import type { Invoice } from './Invoice'

export interface IInvoiceRepository {
  /** Facturas del usuario, más recientes primero. */
  listByUser(userId: string): Promise<Invoice[]>
}
