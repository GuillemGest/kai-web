import { useEffect, useRef, useState } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { Button } from '../Button/Button'
import { LanguageSelector } from '../LanguageSelector/LanguageSelector'
import { useLocale } from '../../../i18n/LocaleContext'
import { authUseCases } from '../../../modules/auth/application/factory'
import { HEADER_CONTENT } from './content'
import './Header.css'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `header__link ${isActive ? 'header__link--active' : ''}`

export function Header() {
  const { locale } = useLocale()
  const content = HEADER_CONTENT[locale]
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  async function handleTrialClick() {
    const user = await authUseCases.getCurrentUser.execute()
    navigate(user ? '/planes' : '/login')
  }

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

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (menuOpen && !dialog.open) dialog.showModal()
    if (!menuOpen && dialog.open) dialog.close()
  }, [menuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo" aria-label={content.logoAriaLabel}>
          <img src="/logo.svg" alt="KAI" className="header__logo-img" />
        </Link>

        <nav className="header__nav" aria-label={content.navAriaLabel}>
          {content.nav.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <LanguageSelector
            triggerAriaLabel={content.languageSelector.triggerAriaLabel}
            menuAriaLabel={content.languageSelector.menuAriaLabel}
          />
          <Link to="/login">
            <Button variant="ghost">{content.actions.loginLabel}</Button>
          </Link>
          <Button variant="primary" onClick={handleTrialClick}>
            {content.actions.ctaLabel}
          </Button>
        </div>

        <button
          type="button"
          className="header__menu-btn"
          aria-label={content.openMenuLabel}
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
        aria-label={content.drawerAriaLabel}
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
              aria-label={content.closeMenuLabel}
              onClick={() => setMenuOpen(false)}
            >
              <X size={24} strokeWidth={2} aria-hidden />
            </button>
          </div>

          <nav className="header__drawer-nav" aria-label={content.navMobileAriaLabel}>
            {content.nav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__drawer-actions">
            <LanguageSelector
              variant="block"
              triggerAriaLabel={content.languageSelector.triggerAriaLabel}
              menuAriaLabel={content.languageSelector.menuAriaLabel}
            />
            <Link to="/login">
              <Button variant="ghost" size="large" className="header__drawer-cta">
                {content.actions.loginLabel}
              </Button>
            </Link>
            <Button
              variant="primary"
              size="large"
              className="header__drawer-cta"
              onClick={handleTrialClick}
            >
              {content.actions.ctaLabel}
            </Button>
          </div>
        </div>
      </dialog>
    </header>
  )
}
