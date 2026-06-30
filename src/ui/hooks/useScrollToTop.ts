import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Resetea el scroll a la parte superior cada vez que cambia la ruta.
 */
export function useScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
}
