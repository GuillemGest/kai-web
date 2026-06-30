import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '../Button/Button'
import './Header.css'

const NAV = [
  { to: '/', label: 'Producto', end: true },
  { to: '/planes', label: 'Planes' },
  { to: '/recursos', label: 'Recursos' },
  { to: '/empresa', label: 'Quiénes somos' },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `header__link ${isActive ? 'header__link--active' : ''}`

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { pathname } = useLocation()

  // Estado de scroll: ancla el header sticky con una sombra al separarse del top.
  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 4))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  // Sincroniza el <dialog> nativo con el estado (modal: trae foco atrapado + backdrop).
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (menuOpen && !dialog.open) dialog.showModal()
    if (!menuOpen && dialog.open) dialog.close()
  }, [menuOpen])

  // Cierra el menú al navegar a otra ruta.
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo" aria-label="KAI — inicio">
          <img src="/logo.svg" alt="KAI" className="header__logo-img" />
        </Link>

        <nav className="header__nav" aria-label="Principal">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <Link to="/login">
            <Button variant="ghost">Iniciar sesión</Button>
          </Link>
          <Link to="/planes">
            <Button variant="primary">Empezar</Button>
          </Link>
        </div>

        <button
          type="button"
          className="header__menu-btn"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={24} strokeWidth={2} aria-hidden />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        className="header__drawer"
        aria-label="Menú de navegación"
        onClose={() => setMenuOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) setMenuOpen(false)
        }}
      >
        <div className="header__drawer-inner">
          <div className="header__drawer-top">
            <span className="header__logo">
              <img src="/logo.svg" alt="KAI" className="header__logo-img" />
            </span>
            <button
              type="button"
              className="header__menu-btn"
              aria-label="Cerrar menú"
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} strokeWidth={2} aria-hidden />
            </button>
          </div>

          <nav className="header__drawer-nav" aria-label="Principal móvil">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__drawer-actions">
            <Link to="/login">
              <Button variant="ghost" size="large" className="header__drawer-cta">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/planes">
              <Button variant="primary" size="large" className="header__drawer-cta">
                Empezar
              </Button>
            </Link>
          </div>
        </div>
      </dialog>
    </header>
  )
}
