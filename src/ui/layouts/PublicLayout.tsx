import { Outlet } from 'react-router-dom'
import { Header } from '../components/Header/Header'
import { Footer } from '../components/Footer/Footer'
import { useScrollToTop } from '../hooks/useScrollToTop'
import './PublicLayout.css'

export function PublicLayout() {
  useScrollToTop()

  return (
    <div className="public-layout">
      <a className="skip-link" href="#contenido">
        Saltar al contenido
      </a>
      <Header />
      <main id="contenido" className="public-layout__main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
