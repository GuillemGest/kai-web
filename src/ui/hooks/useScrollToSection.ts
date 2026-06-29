import { useCallback, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Hook para hacer scroll a una sección que solo existe en una ruta concreta
 * (p. ej. el calendario, que vive en la home). Si ya estás en `targetPath`
 * hace scroll directo; si no, navega allí y deja el scroll pendiente vía
 * `location.state` para que `useScrollOnArrival` lo complete al llegar.
 */
export function useScrollToSection(selector: string, targetPath = '/') {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(() => {
    if (location.pathname !== targetPath) {
      navigate(targetPath, { state: { scrollTo: selector } })
    } else {
      document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [navigate, location.pathname, selector, targetPath])
}

/**
 * Completa el scroll pendiente cuando se llega a la ruta destino. `ready`
 * debe pasar a `true` cuando la sección ya está montada en el DOM (p. ej.
 * tras cargar los datos que la renderizan).
 */
export function useScrollOnArrival(ready: boolean) {
  const location = useLocation()

  useEffect(() => {
    const selector = location.state?.scrollTo
    if (!selector || !ready) return
    const id = window.setTimeout(() => {
      document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
    return () => window.clearTimeout(id)
  }, [location.state, ready])
}
