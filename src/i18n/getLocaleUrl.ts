import { DEFAULT_LOCALE, type Locale } from './locales'

/**
 * Construye la URL de `path` (p. ej. "/planes") para `locale`, siguiendo el
 * routing de Astro: el locale por defecto (es) no lleva prefijo, el resto sí
 * (`/en/planes`, `/ca/planes`).
 */
export function getLocaleUrl(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path.replace(/^\//, '')
  if (locale === DEFAULT_LOCALE) return `/${clean}`
  return `/${locale}/${clean}`.replace(/\/$/, '') || `/${locale}`
}

/**
 * Dada la pathname actual (con o sin prefijo de locale) devuelve la ruta
 * "desnuda" sin prefijo, para poder recalcularla en otro idioma.
 */
export function stripLocalePrefix(pathname: string, locales: readonly Locale[]): string {
  for (const locale of locales) {
    if (locale === DEFAULT_LOCALE) continue
    const prefix = `/${locale}/`
    if (pathname === `/${locale}`) return '/'
    if (pathname.startsWith(prefix)) return `/${pathname.slice(prefix.length)}`
  }
  return pathname
}
