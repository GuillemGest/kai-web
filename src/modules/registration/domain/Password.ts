import { WeakPasswordError } from './WeakPasswordError'

/** Identificadores de cada regla de la política de contraseña. */
export type PasswordRequirement =
  | 'length'
  | 'uppercase'
  | 'lowercase'
  | 'number'
  | 'symbol'

/** Estado de cumplimiento de cada requisito para una cadena dada. */
export type PasswordRequirementStatus = Record<PasswordRequirement, boolean>

/**
 * Value Object: contraseña de la cuenta.
 *
 * Política de dominio (todas obligatorias):
 * - entre 8 y 20 caracteres
 * - al menos una mayúscula, una minúscula, un número y un símbolo
 *
 * Se valida al construir, de modo que cualquier `Password` existente cumple la
 * política por definición.
 */
export class Password {
  static readonly MIN_LENGTH = 8
  static readonly MAX_LENGTH = 20

  private constructor(readonly value: string) {}

  /** Estado de cada requisito para `raw` (sin lanzar). Útil para feedback en UI. */
  static requirements(raw: string): PasswordRequirementStatus {
    return {
      length: raw.length >= Password.MIN_LENGTH && raw.length <= Password.MAX_LENGTH,
      uppercase: /[A-Z]/.test(raw),
      lowercase: /[a-z]/.test(raw),
      number: /\d/.test(raw),
      symbol: /[^A-Za-z0-9]/.test(raw),
    }
  }

  static isValid(raw: string): boolean {
    return Object.values(Password.requirements(raw)).every(Boolean)
  }

  static fromString(raw: string): Password {
    if (!Password.isValid(raw)) {
      throw new WeakPasswordError()
    }
    return new Password(raw)
  }
}
