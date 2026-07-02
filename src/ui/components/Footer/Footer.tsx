import { Link } from 'react-router-dom'
import { useLocale } from '../../../i18n/LocaleContext'
import { FOOTER_CONTENT } from './content'
import './Footer.css'

export function Footer() {
  const { locale } = useLocale()
  const { tagline, legalTemplate, columns } = FOOTER_CONTENT[locale]
  const legal = legalTemplate.replace('{year}', String(new Date().getFullYear()))

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">KAI</span>
          <p className="footer__tagline">{tagline}</p>
        </div>

        <div className="footer__cols">
          {columns.map((col) => (
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
        <span>{legal}</span>
      </div>
    </footer>
  )
}
