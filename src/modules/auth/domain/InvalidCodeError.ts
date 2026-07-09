/**
 * Error de dominio: el código de verificación (2FA) no es válido o ha expirado.
 *
 * Se lanza en el segundo paso del login, al validar el código que el usuario
 * introduce tras recibir sus credenciales correctas en el primer paso.
 */
export class InvalidCodeError extends Error {
  constructor() {
    super('Invalid verification code')
    this.name = 'InvalidCodeError'
  }
}
