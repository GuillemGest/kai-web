import type { AuthSession } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'

/**
 * Devuelve la sesión completa (con token) en curso, de forma síncrona.
 *
 * A diferencia de `GetCurrentUserSync`, expone el token, necesario para llamadas
 * autenticadas a endpoints del backend (p. ej. administración de usuarios) desde
 * el cliente sin re-leer la cookie manualmente.
 */
export class GetCurrentSessionSync {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): AuthSession | null {
    return this.repository.getCurrentSessionSync()
  }
}
