import type { CachedSessionPrimitive } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'

/**
 * Roster local de cuentas guardadas (multi-cuenta en el header). Incluye la
 * cuenta activa; el consumidor filtra por email+organizationId contra
 * `getCurrentSessionSync()` si quiere "otras cuentas".
 */
export class GetSavedAccounts {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): CachedSessionPrimitive[] {
    return this.repository.getSavedAccounts()
  }
}
