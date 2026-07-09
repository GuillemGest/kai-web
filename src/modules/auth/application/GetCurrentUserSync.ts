import type { IAuthRepository } from '../domain/IAuthRepository'
import type { User } from '../domain/User'

/**
 * Devuelve el usuario en sesión de forma síncrona (sin promesa).
 *
 * Se usa en el primer render de las islas del header para pintar directamente
 * el estado correcto y evitar el parpadeo "Iniciar sesión → Mi cuenta".
 */
export class GetCurrentUserSync {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): User | null {
    return this.repository.getCurrentUserSync()
  }
}
