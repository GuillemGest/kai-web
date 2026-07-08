import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { Globe, Check, ChevronDown } from 'lucide-react'
import { LOCALES, LOCALE_LABELS, type Locale } from '../../i18n/locales'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import './LanguageSelector.css'

interface LanguageSelectorProps {
  locale: Locale
  currentPath: string
  triggerAriaLabel: string
  menuAriaLabel: string
  variant?: 'inline' | 'block'
}

export function LanguageSelector({
  locale,
  currentPath,
  triggerAriaLabel,
  menuAriaLabel,
  variant = 'inline',
}: LanguageSelectorProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    function handlePointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function handleSelect(next: Locale) {
    setOpen(false)
    // Navega a la misma ruta en el idioma seleccionado. El BaseLayout ya
    // persiste `kai:locale` en localStorage en cada carga, no se duplica aqui.
    window.location.assign(getLocaleUrl(currentPath, next))
  }

  return (
    <div className={`lang lang--${variant}`} ref={rootRef}>
      <button
        type="button"
        className="lang__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={triggerAriaLabel}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe size={16} strokeWidth={2} aria-hidden />
        <span className="lang__code">{LOCALE_LABELS[locale].short}</span>
        <ChevronDown size={14} strokeWidth={2} aria-hidden className="lang__chev" />
      </button>

      {open && (
        <ul id={menuId} role="listbox" aria-label={menuAriaLabel} className="lang__menu">
          {LOCALES.map((code, i) => {
            const active = code === locale
            return (
              <li key={code} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  className={`lang__option ${active ? 'lang__option--active' : ''}`}
                  style={{ '--lang-i': i } as CSSProperties}
                  onClick={() => handleSelect(code)}
                >
                  <span className="lang__option-short">{LOCALE_LABELS[code].short}</span>
                  <span className="lang__option-long">{LOCALE_LABELS[code].long}</span>
                  {active && <Check size={14} strokeWidth={2} aria-hidden />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
