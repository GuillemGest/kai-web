import type { AuthSession } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'

/**
 * Segundo paso del login (2FA): valida el código que el usuario introduce tras
 * el primer paso ({@link Login}) y devuelve la sesión autenticada.
 */
export class ValidateLoginCode {
  constructor(private readonly repository: IAuthRepository) {}

  execute(email: string, code: string): Promise<AuthSession> {
    return this.repository.validateCode(email, code)
  }
}
