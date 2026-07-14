/**
 * Estados visibles de factura. Alineados con los de Stripe (menos `draft`,
 * que no se lista) y con `refunded` propio para reembolsos.
 */
export type InvoiceStatus = 'paid' | 'open' | 'void' | 'uncollectible' | 'refunded'

export interface InvoicePrimitive {
  id: string
  userId: string
  /** Número visible de factura (p. ej. "KAI-2026-0007"). */
  number: string
  /** Importe total en la unidad menor de la moneda (céntimos), como Stripe. */
  amount: number
  currency: string
  status: InvoiceStatus
  /** Fecha de emisión ISO 8601. */
  issuedAt: string
  /** Descripción del periodo facturado (p. ej. "Full Pro · Julio 2026"). */
  description: string
  /** URL del PDF descargable; `null` mientras no se ha generado. */
  pdfUrl: string | null
}

export class Invoice {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly number: string,
    readonly amount: number,
    readonly currency: string,
    readonly status: InvoiceStatus,
    readonly issuedAt: string,
    readonly description: string,
    readonly pdfUrl: string | null,
  ) {}

  get isPaid(): boolean {
    return this.status === 'paid'
  }

  static fromPrimitive(data: InvoicePrimitive): Invoice {
    return new Invoice(
      data.id,
      data.userId,
      data.number,
      data.amount,
      data.currency,
      data.status,
      data.issuedAt,
      data.description,
      data.pdfUrl,
    )
  }

  toPrimitive(): InvoicePrimitive {
    return {
      id: this.id,
      userId: this.userId,
      number: this.number,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      issuedAt: this.issuedAt,
      description: this.description,
      pdfUrl: this.pdfUrl,
    }
  }
}
