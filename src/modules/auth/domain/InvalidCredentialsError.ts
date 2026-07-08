/**
 * Error de dominio: las credenciales no corresponden a ninguna cuenta.
 *
 * Se lanza tanto si el email no existe como si la contraseña no coincide,
 * deliberadamente indistinguible desde fuera para no revelar qué emails están
 * registrados (buena práctica de seguridad en autenticación).
 */
export class InvalidCredentialsError extends Error {
  constructor() {
    super('Invalid credentials')
    this.name = 'InvalidCredentialsError'
  }
}
