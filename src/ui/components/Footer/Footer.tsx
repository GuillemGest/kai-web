import { Link } from 'react-router-dom'
import './Footer.css'

const COLUMNS = [
  {
    title: 'Producto',
    links: [
      { to: '/', label: 'Producto' },
      { to: '/descargar', label: 'Descargar' },
      { to: '/planes', label: 'Planes' },
    ],
  },
  {
    title: 'Recursos',
    links: [
      { to: '/soporte', label: 'Soporte' },
      { to: '/cuenta', label: 'Mi cuenta' },
    ],
  },
  {
    title: 'Compañía',
    links: [{ to: '/empresa', label: 'Sobre KAI' }],
  },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">KAI</span>
          <p className="footer__tagline">
            El asistente de IA para encontrar y exportar los momentos clave de tus vídeos.
          </p>
        </div>

        <div className="footer__cols">
          {COLUMNS.map((col) => (
            <div key={col.title} className="footer__col">
              <h3 className="footer__col-title">{col.title}</h3>
              {col.links.map((link) => (
                <Link key={link.to + link.label} to={link.to} className="footer__link">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} KAI · Gestmusic — Amplify</span>
      </div>
    </footer>
  )
}
