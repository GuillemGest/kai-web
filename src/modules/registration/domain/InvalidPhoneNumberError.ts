/**
 * Error de dominio: el número de teléfono no tiene un formato válido
 * (ver la regla en el Value Object `PhoneNumber`).
 */
export class InvalidPhoneNumberError extends Error {
  constructor() {
    super('Phone number does not have a valid format')
    this.name = 'InvalidPhoneNumberError'
  }
}
