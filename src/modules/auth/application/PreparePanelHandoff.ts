import type { IAuthRepository } from '../domain/IAuthRepository'

/**
 * Prepara el salto SSO desde kai-web al panel de KAI (kai.amplifysoft.io).
 *
 * kai-web puede servirse bajo un dominio distinto (p. ej. kaistories.io), donde
 * la cookie SSO de `.amplifysoft.io` NO existe. Este caso de uso reemite esa
 * cookie ANTES de redirigir: llama a `setSsoCookie` con el token de la sesión
 * actual, lo que hace que el backend (en `authentication.amplifysoft.io`) emita
 * la cookie `Domain=.amplifysoft.io`. Como el navegador la asocia a ese dominio,
 * `kai.amplifysoft.io` ya la enviará y KAI hidrata la sesión sin re-login.
 *
 * Devuelve `true` si había sesión (y por tanto procede el salto al panel), o
 * `false` si no la hay (el llamante debe mandar al login).
 */
export class PreparePanelHandoff {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(): Promise<boolean> {
    const session = this.repository.getCurrentSessionSync()
    if (!session) return false
    await this.repository.setSsoCookie(session.token)
    return true
  }
}
