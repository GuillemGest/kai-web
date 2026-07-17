/**
 * Errores de dominio de la gestión de métodos de pago. Viven en domain porque
 * también los lanza la infraestructura al verificar titularidad contra
 * Stripe, y la dependencia debe apuntar hacia dentro (infrastructure → domain).
 */

/** La tarjeta no existe o no pertenece al email indicado (misma respuesta a propósito: no revelar cuál). */
export class PaymentMethodNotFoundError extends Error {
  constructor(paymentMethodId: string) {
    super(`Método de pago ${paymentMethodId} no encontrado para este usuario`)
    this.name = 'PaymentMethodNotFoundError'
  }
}

/** No se puede eliminar la única tarjeta guardada mientras cobra una suscripción activa. */
export class CannotRemoveOnlyPaymentMethodError extends Error {
  constructor(paymentMethodId: string) {
    super(`No se puede eliminar la tarjeta ${paymentMethodId}: es la única y hay suscripciones activas`)
    this.name = 'CannotRemoveOnlyPaymentMethodError'
  }
}
