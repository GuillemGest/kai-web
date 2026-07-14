import { WeakPasswordError } from './WeakPasswordError'

/**
 * Value Object: contraseña de la cuenta.
 *
 * Regla de dominio: mínimo 8 caracteres. Se valida al construir, de modo que
 * cualquier `Password` existente es válido por definición.
 */
export class Password {
  static readonly MIN_LENGTH = 8

  private constructor(readonly value: string) {}

  static fromString(raw: string): Password {
    if (raw.length < Password.MIN_LENGTH) {
      throw new WeakPasswordError()
    }
    return new Password(raw)
  }
}
