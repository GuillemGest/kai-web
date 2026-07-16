/**
 * Errores de dominio de la gestión de suscripciones. Viven en domain (y no en
 * el use case, como los del checkout) porque también los lanza la
 * infraestructura al verificar titularidad/estado contra Stripe, y la
 * dependencia debe apuntar hacia dentro (infrastructure → domain).
 */

/** La suscripción no existe o no pertenece al email indicado (misma respuesta a propósito: no revelar cuál). */
export class SubscriptionNotFoundError extends Error {
  constructor(subscriptionId: string) {
    super(`Suscripción ${subscriptionId} no encontrada para este usuario`)
    this.name = 'SubscriptionNotFoundError'
  }
}

/** La suscripción no admite gestión (p. ej. ya cancelada del todo). */
export class SubscriptionNotManageableError extends Error {
  constructor(subscriptionId: string) {
    super(`La suscripción ${subscriptionId} no admite esta operación`)
    this.name = 'SubscriptionNotManageableError'
  }
}

/** Cambio de plan al mismo plan que ya tiene la suscripción. */
export class SamePlanError extends Error {
  constructor(planId: string) {
    super(`La suscripción ya está en el plan ${planId}`)
    this.name = 'SamePlanError'
  }
}

/** El plan de destino no admite los usuarios extra contratados en la suscripción. */
export class SeatLimitExceededError extends Error {
  constructor(planId: string) {
    super(`El plan ${planId} no admite los usuarios adicionales contratados`)
    this.name = 'SeatLimitExceededError'
  }
}
