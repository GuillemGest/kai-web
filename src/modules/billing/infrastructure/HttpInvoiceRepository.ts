import type { IInvoiceRepository } from '../domain/IInvoiceRepository'
import { Invoice, type InvoicePrimitive } from '../domain/Invoice'

/**
 * Implementación de CLIENTE del repositorio de facturas: delega en el endpoint
 * SSR `/api/invoices`, que es quien habla con Stripe usando la clave secreta.
 * Así el island sigue llamando a `billingUseCases.getInvoices` sin saber de
 * dónde salen los datos, y la secret key nunca entra al bundle del navegador.
 */
export class HttpInvoiceRepository implements IInvoiceRepository {
  async listByEmail(email: string): Promise<Invoice[]> {
    const res = await fetch(`/api/invoices?email=${encodeURIComponent(email)}`)

    const data = (await res.json().catch(() => null)) as {
      invoices?: InvoicePrimitive[]
      error?: string
    } | null

    if (!res.ok || !data?.invoices) {
      throw new Error(data?.error ?? 'No se pudieron cargar las facturas.')
    }

    return data.invoices.map(Invoice.fromPrimitive)
  }
}
