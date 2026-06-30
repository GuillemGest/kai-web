import { useEffect } from 'react'

/**
 * Revela los elementos marcados con `data-reveal` al entrar en el viewport
 * (fade + leve subida, una sola vez). El estilo vive en globals.css (`.reveal`).
 *
 * Garantías:
 * - Sin JS / headless: la clase `.reveal` (estado oculto) nunca se añade, así que
 *   el contenido queda visible por defecto — el reveal solo realza, no lo gatea.
 * - `prefers-reduced-motion`: no se observa nada; todo aparece de inmediato.
 * - Revela una vez (deja de observar tras entrar): no se des-revela al subir.
 *
 * Llamar una vez por página tras el render. Re-ejecuta cuando cambia `deps`
 * (p. ej. al llegar datos asíncronos que añaden nuevos `[data-reveal]`).
 */
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!motionOk || !('IntersectionObserver' in window) || targets.length === 0) return

    targets.forEach((el) => el.classList.add('reveal'))
    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        }
      },
      { rootMargin: '0px 0px -5% 0px', threshold: 0.1 },
    )
    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
