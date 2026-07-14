/**
 * Error de dominio: la contraseña no cumple la política mínima de seguridad
 * (ver la regla en el Value Object `Password`).
 */
export class WeakPasswordError extends Error {
  constructor() {
    super('Password does not meet the minimum requirements')
    this.name = 'WeakPasswordError'
  }
}
