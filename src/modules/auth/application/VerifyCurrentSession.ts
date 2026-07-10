import type { AuthSession } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'

/**
 * Confirma con el backend que la sesión persistida sigue viva. Se ejecuta en
 * el primer render de cliente tras un F5 para detectar tokens caducados o
 * revocados y sacar al usuario si procede.
 */
export class VerifyCurrentSession {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): Promise<AuthSession | null> {
    return this.repository.verifySession()
  }
}
