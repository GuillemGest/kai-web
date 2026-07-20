import type { Locale } from './locales'

// Prefijo del subdirectorio donde se sirve la app (p.ej. '/kai-web/' en GitHub
// Pages, '/' en local). Vite lo expone en import.meta.env.BASE_URL y siempre
// termina en '/'. Se recorta la barra final para componer las rutas.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

/**
 * Construye la URL de `path` (p. ej. "/planes") para `locale`, incluyendo el
 * `base` del despliegue. Todos los idiomas llevan prefijo:
 * `/kai-web/es/planes`, `/kai-web/en/planes`, etc. (o sin `/kai-web` en local).
 */
export function getLocaleUrl(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path.replace(/^\//, '')
  const localePath = `/${locale}/${clean}`.replace(/\/$/, '') || `/${locale}`
  return `${BASE}${localePath}`
}

/**
 * Dada la pathname actual (con `base` y prefijo de locale) devuelve la ruta
 * "desnuda" sin ninguno de los dos, para poder recalcularla en otro idioma.
 * Es la operación inversa de `getLocaleUrl`.
 */
export function stripLocalePrefix(pathname: string, locales: readonly Locale[]): string {
  // El pathname real incluye el `base` del despliegue; se quita primero para
  // poder detectar el prefijo de locale que va justo detrás.
  const withoutBase = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname

  for (const locale of locales) {
    const prefix = `/${locale}/`
    if (withoutBase === `/${locale}`) return '/'
    if (withoutBase.startsWith(prefix)) return `/${withoutBase.slice(prefix.length)}`
  }
  return withoutBase
}
