import type { PaymentMethod } from './PaymentMethod'

export interface IPaymentMethodRepository {
  /**
   * TODAS las tarjetas guardadas del email indicado (identidad de facturación,
   * igual que suscripciones/facturas), con `isDefault` marcando cuál cobra la
   * renovación. Vacío si el Customer no tiene tarjetas o no existe.
   */
  listByEmail(email: string): Promise<PaymentMethod[]>

  /**
   * Marca `paymentMethodId` como la tarjeta que cobrará la renovación. El
   * email verifica la titularidad: si la tarjeta no pertenece a ese email, la
   * operación falla.
   */
  setDefault(email: string, paymentMethodId: string): Promise<void>
}
