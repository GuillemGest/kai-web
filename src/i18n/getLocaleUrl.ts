import type { Locale } from './locales'

/**
 * Construye la URL de `path` (p. ej. "/planes") para `locale`.
 * Todos los idiomas llevan prefijo: `/es/planes`, `/en/planes`, `/ca/planes`.
 */
export function getLocaleUrl(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path.replace(/^\//, '')
  return `/${locale}/${clean}`.replace(/\/$/, '') || `/${locale}`
}

/**
 * Dada la pathname actual (con prefijo de locale) devuelve la ruta
 * "desnuda" sin prefijo, para poder recalcularla en otro idioma.
 */
export function stripLocalePrefix(pathname: string, locales: readonly Locale[]): string {
  for (const locale of locales) {
    const prefix = `/${locale}/`
    if (pathname === `/${locale}`) return '/'
    if (pathname.startsWith(prefix)) return `/${pathname.slice(prefix.length)}`
  }
  return pathname
}
