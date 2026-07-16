/**
 * Iniciales para avatares: primeras dos letras de las dos primeras palabras.
 * Se conserva la caja original (el consumidor decide si aplicar text-transform).
 */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
}
