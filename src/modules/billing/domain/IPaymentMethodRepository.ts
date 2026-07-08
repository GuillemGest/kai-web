import type { PaymentMethod } from './PaymentMethod'

export interface IPaymentMethodRepository {
  /** Método de pago por defecto del usuario; `null` si no tiene ninguno. */
  getDefault(userId: string): Promise<PaymentMethod | null>
}
