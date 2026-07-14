import type { IInvoiceRepository } from '../domain/IInvoiceRepository'
import type { Invoice } from '../domain/Invoice'

export class GetInvoices {
  constructor(private readonly repository: IInvoiceRepository) {}

  execute(email: string): Promise<Invoice[]> {
    return this.repository.listByEmail(email)
  }
}
