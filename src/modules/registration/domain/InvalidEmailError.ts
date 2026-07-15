/**
 * Error de dominio: el correo electrónico no tiene un formato válido
 * (ver la regla en el Value Object `Email`).
 */
export class InvalidEmailError extends Error {
  constructor() {
    super('Email does not have a valid format')
    this.name = 'InvalidEmailError'
  }
}
