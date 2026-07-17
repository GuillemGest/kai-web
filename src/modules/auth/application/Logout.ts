import type { AuthSession } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'

/**
 * Resultado del logout multi-cuenta:
 *  - `switched`: había otra cuenta guardada válida; ahora es la activa.
 *  - `signed_out`: no había otras cuentas (o todas expiraron); estado unauthed.
 */
export type LogoutResult =
  | { kind: 'switched'; session: AuthSession }
  | { kind: 'signed_out' }

/**
 * Cierra la sesión ACTIVA. Solo la activa: las demás cuentas guardadas en el
 * roster local se conservan. Si al retirar la activa queda otra cuenta
 * guardada, se intenta activarla automáticamente (preflight contra el
 * backend). Si el token de la candidata expiró o la red falla, se retira
 * también del roster y se prueba la siguiente. Si no queda ninguna válida,
 * se realiza el logout completo (cookie + cached_session).
 */
export class Logout {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(): Promise<LogoutResult> {
    const active = this.repository.getCurrentSessionSync()
    if (active) {
      // Quita la activa del roster ANTES de buscar candidata para que no se
      // "auto-cambie" a sí misma.
      this.repository.removeSavedAccount(
        active.user.email,
        active.organization?.id,
      )
    }

    // Cerramos ya la sesión actual (cookie + cached_session). Si conseguimos
    // switch a otra guardada, `switchToSavedAccount` re-persistirá cookie y
    // cached_session con el nuevo token.
    await this.repository.logout()

    // Prioriza la entrada más reciente del roster (mismo orden LRU en el que
    // se guardan).
    let candidates = this.repository.getSavedAccounts()
    for (const entry of candidates) {
      const result = await this.repository.switchToSavedAccount(entry)
      if (result.ok) return { kind: 'switched', session: result.session }
      // `switchToSavedAccount` ya retira del roster las entradas expiradas;
      // recargamos por si la próxima iteración se ve afectada.
      candidates = this.repository.getSavedAccounts()
      if (candidates.length === 0) break
    }

    return { kind: 'signed_out' }
  }
}
