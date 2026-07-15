import { InvalidPhoneNumberError } from './InvalidPhoneNumberError'

/**
 * Value Object: número de teléfono.
 *
 * Regla de dominio: opcional `+` inicial y entre 7 y 15 dígitos (rango E.164),
 * admitiendo espacios, guiones y paréntesis como separadores visuales. Se valida
 * al construir, de modo que cualquier `PhoneNumber` existente es válido.
 */
export class PhoneNumber {
  // Separadores visuales permitidos en la entrada del usuario.
  private static readonly SEPARATORS = /[\s()-]/g
  private static readonly PATTERN = /^\+?\d{7,15}$/

  private constructor(readonly value: string) {}

  static isValid(raw: string): boolean {
    const compact = raw.replace(PhoneNumber.SEPARATORS, '')
    return PhoneNumber.PATTERN.test(compact)
  }

  static fromString(raw: string): PhoneNumber {
    const normalized = raw.trim()
    if (!PhoneNumber.isValid(normalized)) {
      throw new InvalidPhoneNumberError()
    }
    return new PhoneNumber(normalized)
  }
}
