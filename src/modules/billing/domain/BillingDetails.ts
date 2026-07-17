export type CustomerType = 'personal' | 'company'

export interface BillingDetailsPrimitive {
  /** Tipo de comprador: personal (particular) o company (empresa/autónomo). */
  customerType: CustomerType
  /** Nombre completo del titular. Solo se usa en modo personal. */
  fullName: string
  /** Razón social o nombre legal al que se emite la factura. Solo modo company. */
  legalName: string
  /** NIF/CIF/NIE del comprador. Solo modo company. */
  taxId: string
  /** Email donde recibir las facturas. Solo modo company (personal usa email de cuenta). */
  billingEmail: string
  /** Dirección fiscal: calle y número. Solo modo company. */
  addressLine: string
  /** Solo modo company. */
  city: string
  postalCode: string
  /** Solo modo company. */
  province: string
  /** Código de país ISO-3166 alpha-2 (p. ej. "ES"). */
  country: string
}

export type BillingDetailsField = keyof Omit<BillingDetailsPrimitive, 'customerType'>

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
  fullName: (v) => v.length >= 2,
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
 * Campos requeridos por tipo de comprador. Personal pide lo mínimo (nombre +
 * país + CP) porque no lleva razón social ni NIF; company mantiene los 8
 * campos fiscales completos.
 */
export const REQUIRED_FIELDS_BY_TYPE: Record<CustomerType, readonly BillingDetailsField[]> = {
  personal: ['fullName', 'postalCode', 'country'],
  company: [
    'legalName',
    'taxId',
    'billingEmail',
    'addressLine',
    'city',
    'postalCode',
    'province',
    'country',
  ],
}

/**
 * Datos fiscales/de facturación de una compra. Complementan al registro de la
 * cuenta (que ya recoge nombre, email de contacto, empresa y teléfono): esto es
 * lo necesario para emitir factura. Value object inmutable: si existe, es válido.
 */
export class BillingDetails {
  private constructor(
    readonly customerType: CustomerType,
    readonly fullName: string,
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
   * Normaliza (trim, NIF y país a mayúsculas) y valida los campos requeridos
   * según `customerType`. Lanza `InvalidBillingDetailsError` con el primer
   * campo inválido. Los campos no requeridos por el tipo quedan como cadena
   * vacía tras la normalización.
   */
  static create(data: BillingDetailsPrimitive): BillingDetails {
    const type: CustomerType = data.customerType === 'company' ? 'company' : 'personal'
    const normalized: Omit<BillingDetailsPrimitive, 'customerType'> = {
      fullName: data.fullName.trim(),
      legalName: data.legalName.trim(),
      taxId: data.taxId.trim().toUpperCase(),
      billingEmail: data.billingEmail.trim(),
      addressLine: data.addressLine.trim(),
      city: data.city.trim(),
      postalCode: data.postalCode.trim(),
      province: data.province.trim(),
      country: data.country.trim().toUpperCase(),
    }
    for (const field of REQUIRED_FIELDS_BY_TYPE[type]) {
      if (!BILLING_FIELD_VALIDATORS[field](normalized[field])) {
        throw new InvalidBillingDetailsError(field)
      }
    }
    return new BillingDetails(
      type,
      normalized.fullName,
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

  get isCompany(): boolean {
    return this.customerType === 'company'
  }

  /** Nombre que se muestra en la factura: razón social en company, titular en personal. */
  get displayName(): string {
    return this.isCompany ? this.legalName : this.fullName
  }

  toPrimitive(): BillingDetailsPrimitive {
    return {
      customerType: this.customerType,
      fullName: this.fullName,
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
