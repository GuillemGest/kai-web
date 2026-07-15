import { InvalidEmailError } from './InvalidEmailError'

/**
 * Value Object: correo electrónico.
 *
 * Regla de dominio: formato `algo@dominio.tld`. Se valida al construir, de modo
 * que cualquier `Email` existente es válido por definición.
 */
export class Email {
  // Formato pragmático: una parte local, una @, un dominio con al menos un punto
  // y un TLD de 2+ letras. No cubre el RFC completo (innecesario en la práctica).
  private static readonly PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  private constructor(readonly value: string) {}

  static isValid(raw: string): boolean {
    return Email.PATTERN.test(raw.trim())
  }

  static fromString(raw: string): Email {
    const normalized = raw.trim()
    if (!Email.isValid(normalized)) {
      throw new InvalidEmailError()
    }
    return new Email(normalized)
  }
}
