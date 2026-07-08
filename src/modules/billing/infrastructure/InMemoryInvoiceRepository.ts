import type { IInvoiceRepository } from '../domain/IInvoiceRepository'
import { Invoice, type InvoicePrimitive } from '../domain/Invoice'

/**
 * Historial de facturas de prototipo (datos mock en memoria).
 * Importes en céntimos (unidad menor), como Stripe. Se sustituirá por
 * SupabaseInvoiceRepository sin tocar use cases ni UI.
 */
const INVOICES: InvoicePrimitive[] = [
  {
    id: 'inv-7',
    userId: 'user-1',
    number: 'KAI-2026-0007',
    amount: 4900,
    currency: 'EUR',
    status: 'paid',
    issuedAt: '2026-06-15T09:00:00.000Z',
    description: 'Full Pro · Junio 2026',
    pdfUrl: '#',
  },
  {
    id: 'inv-6',
    userId: 'user-1',
    number: 'KAI-2026-0006',
    amount: 4900,
    currency: 'EUR',
    status: 'paid',
    issuedAt: '2026-05-15T09:00:00.000Z',
    description: 'Full Pro · Mayo 2026',
    pdfUrl: '#',
  },
  {
    id: 'inv-5',
    userId: 'user-1',
    number: 'KAI-2026-0005',
    amount: 4900,
    currency: 'EUR',
    status: 'paid',
    issuedAt: '2026-04-15T09:00:00.000Z',
    description: 'Full Pro · Abril 2026',
    pdfUrl: '#',
  },
  {
    id: 'inv-4',
    userId: 'user-1',
    number: 'KAI-2026-0004',
    amount: 2900,
    currency: 'EUR',
    status: 'paid',
    issuedAt: '2026-03-15T09:00:00.000Z',
    description: 'Starter · Marzo 2026',
    pdfUrl: '#',
  },
]

export class InMemoryInvoiceRepository implements IInvoiceRepository {
  async listByUser(userId: string): Promise<Invoice[]> {
    return INVOICES.filter((inv) => inv.userId === userId)
      .sort((a, b) => b.issuedAt.localeCompare(a.issuedAt))
      .map(Invoice.fromPrimitive)
  }
}
