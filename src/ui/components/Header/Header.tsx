import { NavLink, Link } from 'react-router-dom'
import { Button } from '../Button/Button'
import './Header.css'

const NAV = [
  { to: '/', label: 'Producto', end: true },
  { to: '/descargar', label: 'Descargar' },
  { to: '/planes', label: 'Planes' },
  { to: '/soporte', label: 'Soporte' },
  { to: '/empresa', label: 'Empresa' },
]

export function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <Link to="/" className="header__logo" aria-label="KAI — inicio">
          KAI
        </Link>

        <nav className="header__nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
            >
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
      </div>
    </header>
  )
}
