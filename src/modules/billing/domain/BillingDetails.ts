export interface BillingDetailsPrimitive {
  /** Razón social o nombre legal al que se emite la factura. */
  legalName: string
  /** NIF/CIF/NIE del comprador. */
  taxId: string
  /** Email donde recibir las facturas. */
  billingEmail: string
  /** Dirección fiscal: calle y número. */
  addressLine: string
  city: string
  postalCode: string
  province: string
  /** Código de país ISO-3166 alpha-2 (p. ej. "ES"). */
  country: string
}

export type BillingDetailsField = keyof BillingDetailsPrimitive

export class InvalidBillingDetailsError extends Error {
  constructor(readonly field: BillingDetailsField) {
    super(`Dato de facturación inválido: ${field}`)
    this.name = 'InvalidBillingDetailsError'
  }
}

/**
 * Patrón laxo para NIF/CIF/NIE españoles (letra o dígito + 7 dígitos + letra o
 * dígito). La validación estricta de checksum la hace Stripe al registrar el
 * tax id; aquí solo se descarta lo claramente malformado sin bloquear formatos
 * legítimos de otros países.
 */
const TAX_ID_PATTERN = /^[A-Z0-9][0-9]{7}[A-Z0-9]$/
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const POSTAL_CODE_PATTERN = /^[A-Z0-9][A-Z0-9 -]{1,8}$/i
const COUNTRY_PATTERN = /^[A-Z]{2}$/

/**
 * Validadores por campo, exportados para que el formulario de la UI aplique
 * EXACTAMENTE las mismas reglas que el value object sin duplicarlas.
 * Reciben el valor ya recortado (trim) — `BillingDetails.create` normaliza.
 */
export const BILLING_FIELD_VALIDATORS: Record<BillingDetailsField, (value: string) => boolean> = {
  legalName: (v) => v.length >= 3,
  taxId: (v) => TAX_ID_PATTERN.test(v.toUpperCase()),
  billingEmail: (v) => EMAIL_PATTERN.test(v),
  addressLine: (v) => v.length > 0,
  city: (v) => v.length > 0,
  postalCode: (v) => POSTAL_CODE_PATTERN.test(v),
  province: (v) => v.length > 0,
  country: (v) => COUNTRY_PATTERN.test(v.toUpperCase()),
}

/**
 * Datos fiscales/de facturación de una compra. Complementan al registro de la
 * cuenta (que ya recoge nombre, email de contacto, empresa y teléfono): esto es
 * lo necesario para emitir factura. Value object inmutable: si existe, es válido.
 */
export class BillingDetails {
  private constructor(
    readonly legalName: string,
    readonly taxId: string,
    readonly billingEmail: string,
    readonly addressLine: string,
    readonly city: string,
    readonly postalCode: string,
    readonly province: string,
    readonly country: string,
  ) {}

  /**
   * Normaliza (trim, NIF y país a mayúsculas) y valida todos los campos.
   * Lanza `InvalidBillingDetailsError` con el primer campo inválido.
   */
  static create(data: BillingDetailsPrimitive): BillingDetails {
    const normalized: BillingDetailsPrimitive = {
      legalName: data.legalName.trim(),
      taxId: data.taxId.trim().toUpperCase(),
      billingEmail: data.billingEmail.trim(),
      addressLine: data.addressLine.trim(),
      city: data.city.trim(),
      postalCode: data.postalCode.trim(),
      province: data.province.trim(),
      country: data.country.trim().toUpperCase(),
    }
    for (const field of Object.keys(BILLING_FIELD_VALIDATORS) as BillingDetailsField[]) {
      if (!BILLING_FIELD_VALIDATORS[field](normalized[field])) {
        throw new InvalidBillingDetailsError(field)
      }
    }
    return new BillingDetails(
      normalized.legalName,
      normalized.taxId,
      normalized.billingEmail,
      normalized.addressLine,
      normalized.city,
      normalized.postalCode,
      normalized.province,
      normalized.country,
    )
  }

  toPrimitive(): BillingDetailsPrimitive {
    return {
      legalName: this.legalName,
      taxId: this.taxId,
      billingEmail: this.billingEmail,
      addressLine: this.addressLine,
      city: this.city,
      postalCode: this.postalCode,
      province: this.province,
      country: this.country,
    }
  }
}
