export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'other'

export interface PaymentMethodPrimitive {
  id: string
  userId: string
  brand: CardBrand
  /** Últimos 4 dígitos de la tarjeta; nunca el número completo. */
  last4: string
  expMonth: number
  expYear: number
  /** Nombre del titular tal como figura en la tarjeta. */
  holderName: string
  /**
   * Es la tarjeta que Stripe usa para cobrar la renovación de la suscripción
   * (`invoice_settings.default_payment_method` del Customer). Solo una tarjeta
   * por Customer puede ser `true` a la vez.
   */
  isDefault: boolean
}

export class PaymentMethod {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly brand: CardBrand,
    readonly last4: string,
    readonly expMonth: number,
    readonly expYear: number,
    readonly holderName: string,
    readonly isDefault: boolean,
  ) {}

  /** Caducidad formateada "MM/AA" para mostrar en UI. */
  get expLabel(): string {
    const mm = String(this.expMonth).padStart(2, '0')
    const yy = String(this.expYear).slice(-2)
    return `${mm}/${yy}`
  }

  static fromPrimitive(data: PaymentMethodPrimitive): PaymentMethod {
    return new PaymentMethod(
      data.id,
      data.userId,
      data.brand,
      data.last4,
      data.expMonth,
      data.expYear,
      data.holderName,
      data.isDefault,
    )
  }

  toPrimitive(): PaymentMethodPrimitive {
    return {
      id: this.id,
      userId: this.userId,
      brand: this.brand,
      last4: this.last4,
      expMonth: this.expMonth,
      expYear: this.expYear,
      holderName: this.holderName,
      isDefault: this.isDefault,
    }
  }
}
