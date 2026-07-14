import type { Locale } from '../i18n/locales'

/**
 * FUENTE ÚNICA DE VERDAD de todas las direcciones externas del proyecto.
 *
 * Regla del proyecto: NINGUNA URL/host se hardcodea fuera de este archivo. Si
 * aparece una dirección nueva (backend, panel, proveedor externo, fuente…), va
 * aquí y el resto del código la importa desde `ORIGINS` / los helpers.
 *
 * `astro.config.mjs` también importa `ORIGINS` para el proxy de desarrollo, así
 * que este módulo debe permanecer libre de dependencias de runtime del navegador.
 */
export const ORIGINS = {
  /** Backend de autenticación Amplify (incluye el prefijo `/api`). */
  authApi: 'https://authentication.amplifysoft.io/api',
  /** Origin canónico de frontend-kai (la app KAI, panel/chat). */
  kaiApp: 'https://kai.amplifysoft.io',
  /** Compositor de correo de Gmail. */
  gmailCompose: 'https://mail.google.com/mail/',
  /** Compositor de correo de Outlook web. */
  outlookCompose: 'https://outlook.office.com/mail/deeplink/compose',
  /** Google Fonts (preconnect + stylesheet). */
  googleFonts: 'https://fonts.googleapis.com',
  googleFontsStatic: 'https://fonts.gstatic.com',
} as const

/**
 * Direcciones de correo de contacto del proyecto. Única fuente de verdad: los
 * contenidos por idioma las referencian desde aquí en vez de repetirlas.
 */
export const CONTACT_EMAILS = {
  /** Soporte / ayuda (guías y recursos). */
  support: 'soporte@kai.app',
  /** Ventas (contacto de KAI Enterprise en la página de planes). */
  sales: 'ventas@kai.app',
  /** Contacto general (página de empresa). */
  general: 'hola@kai.app',
} as const

/** URL del stylesheet de la familia tipográfica del sitio (Google Fonts). */
export const GOOGLE_FONTS_STYLESHEET =
  `${ORIGINS.googleFonts}/css2?family=Plus+Jakarta+Sans:wght@400;700&display=swap` as const

/**
 * Base del API de autenticación. Llamada directa al backend en todos los
 * entornos (dev incluido: el server corre en localhost:3000, origen permitido
 * por el backend, así que no hace falta proxy).
 */
export const AUTH_API_BASE = ORIGINS.authApi

/**
 * URL del panel (chat) de frontend-kai para un locale dado.
 *
 * Usada como destino del handoff SSO tras un login/registro exitoso: la cookie
 * HttpOnly del backend (`.amplifysoft.io`) viaja con esta petición y
 * frontend-kai hidrata sesión sin pedir credenciales de nuevo.
 */
export function kaiPanelUrl(locale: Locale): string {
  return `${ORIGINS.kaiApp}/${locale}/chat`
}
