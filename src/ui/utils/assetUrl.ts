/**
 * Devuelve la URL de un asset de la carpeta `public/` teniendo en cuenta el
 * `base` de Vite (import.meta.env.BASE_URL). Necesario para que las imágenes,
 * vídeos y demás recursos funcionen cuando la app se sirve bajo un subdirectorio
 * (p.ej. GitHub Pages en `/kai-web/`) y no solo en la raíz.
 *
 * Acepta rutas con o sin barra inicial: assetUrl('/logo.svg') y
 * assetUrl('logo.svg') devuelven lo mismo.
 */
export function assetUrl(path: string): string {
  const base = import.meta.env.BASE_URL // termina siempre en '/'
  const cleanPath = path.replace(/^\//, '')
  return `${base}${cleanPath}`
}
