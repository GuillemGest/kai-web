import type { PaymentMethod } from './PaymentMethod'

export interface IPaymentMethodRepository {
  /**
   * TODAS las tarjetas guardadas de la organización indicada (identidad de
   * facturación, igual que suscripciones/facturas), con `isDefault` marcando
   * cuál cobra la renovación. Vacío si el Customer no tiene tarjetas o no existe.
   */
  listByOrganization(organizationId: string): Promise<PaymentMethod[]>

  /**
   * Marca `paymentMethodId` como la tarjeta que cobrará la renovación. La
   * organización verifica la titularidad: si la tarjeta no le pertenece, la
   * operación falla.
   */
  setDefault(organizationId: string, paymentMethodId: string): Promise<void>

  /**
   * Elimina `paymentMethodId` (la desvincula del Customer en Stripe). La
   * organización verifica la titularidad, igual que en `setDefault`.
   */
  remove(organizationId: string, paymentMethodId: string): Promise<void>
}
