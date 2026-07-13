import type { Locale } from '../i18n/locales'

/** Origin canónico de frontend-kai (la app KAI, panel/chat). */
export const KAI_APP_ORIGIN = 'https://kai.amplifysoft.io'

/**
 * URL del panel (chat) de frontend-kai para un locale dado.
 *
 * Usada como destino del handoff SSO tras un login/registro exitoso: la cookie
 * HttpOnly del backend (`.amplifysoft.io`) viaja con esta petición y
 * frontend-kai hidrata sesión sin pedir credenciales de nuevo.
 */
export function kaiPanelUrl(locale: Locale): string {
  return `${KAI_APP_ORIGIN}/${locale}/chat`
}

/**
 * ¿Puede el navegador actual completar el handshake SSO al panel?
 *
 * La cookie HttpOnly emitida por `authentication.amplifysoft.io/api/login/set/cookie`
 * lleva `Domain=.amplifysoft.io; Secure; SameSite=None`. Para que el navegador
 * la acepte y luego la envíe a `kai.amplifysoft.io`, la página que dispara la
 * llamada debe:
 *  - servirse sobre https, y
 *  - estar bajo un subdominio de `amplifysoft.io` (mismo registrable domain).
 *
 * En dev local (`localhost:4321`, http) no se cumple, así que el handoff se
 * salta y volvemos al fallback local (`/cuenta`).
 */
export function canSsoHandoff(): boolean {
  if (typeof window === 'undefined') return false
  const { protocol, hostname } = window.location
  const httpsOk = protocol === 'https:'
  const domainOk = hostname === 'amplifysoft.io' || hostname.endsWith('.amplifysoft.io')
  return httpsOk && domainOk
}
