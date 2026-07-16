import type { CachedSessionPrimitive } from '../domain/AuthSession'
import type { IAuthRepository, SwitchAccountResult } from '../domain/IAuthRepository'

/**
 * Cambia la sesión activa a una cuenta guardada del roster local. Preflight
 * contra el backend antes de tocar cookie/localStorage: si el token está
 * expirado la sesión activa permanece intacta y la entrada se retira del
 * roster; si hay error de red se aborta sin efectos secundarios.
 */
export class SwitchAccount {
  constructor(private readonly repository: IAuthRepository) {}

  execute(entry: CachedSessionPrimitive): Promise<SwitchAccountResult> {
    return this.repository.switchToSavedAccount(entry)
  }
}
