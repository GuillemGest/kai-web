import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'
import { PaymentMethod, type PaymentMethodPrimitive } from '../domain/PaymentMethod'

/**
 * Método de pago de prototipo (datos mock en memoria).
 * Nunca guarda el número completo de tarjeta, solo los últimos 4 dígitos.
 * Se sustituirá por SupabasePaymentMethodRepository sin tocar use cases ni UI.
 */
const PAYMENT_METHOD: PaymentMethodPrimitive = {
  id: 'pm-1',
  userId: 'user-1',
  brand: 'visa',
  last4: '4242',
  expMonth: 11,
  expYear: 2028,
  holderName: 'Usuario Demo',
}

export class InMemoryPaymentMethodRepository implements IPaymentMethodRepository {
  async getDefault(userId: string): Promise<PaymentMethod | null> {
    return userId === PAYMENT_METHOD.userId ? PaymentMethod.fromPrimitive(PAYMENT_METHOD) : null
  }
}
