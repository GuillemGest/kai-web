import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from 'react'
import { ChevronDown, CircleUser, Plus, Settings, Trash2 } from 'lucide-react'
import { authUseCases } from '../../modules/auth/application/factory'
import type { CachedSessionPrimitive } from '../../modules/auth/domain/AuthSession'
import { Button } from '../components/Button/Button'
import { initials } from '../utils/initials'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import './AccountMenu.css'

export interface AccountsMenuContent {
  accountLabel: string
  triggerAriaLabel: string
  menuAriaLabel: string
  activeBadge: string
  noOrg: string
  switchToAria: string // "Cambiar a {name}"
  removeAccountAria: string // "Eliminar cuenta guardada {name}"
  addNew: string
  switchErrorLabel: string
  /** Enlace a los ajustes de la cuenta activa (/cuenta), dentro de la fila destacada. */
  settingsLabel: string
}

interface AccountMenuProps {
  locale: Locale
  currentPath: string
  variant?: 'inline' | 'block'
  content: AccountsMenuContent
}

/**
 * Desplegable multi-cuenta del header.
 *
 * Sesión activa arriba (con badge accent), otras cuentas guardadas debajo,
 * y en el pie un botón "Añadir cuenta nueva" que lleva al login preservando
 * la activa. Reusa el look de `LanguageSelector` (tokens, sombra, easing) y
 * los botones del sistema.
 *
 * Comportamiento:
 * - En desktop se abre en hover (gated por `hover:hover` para no dispararse en
 *   touch) y también con click; cierra al salir con delay corto o al pulsar
 *   una acción.
 * - En el drawer móvil (variant="block") es una lista estática, sin hover ni
 *   posicionamiento absoluto, coherente con `LanguageSelector.block`.
 */
export function AccountMenu({
  locale,
  currentPath: _currentPath,
  variant = 'inline',
  content,
}: AccountMenuProps) {
  const [open, setOpen] = useState(false)
  const [pendingKey, setPendingKey] = useState<string | null>(null)
  const [errorKey, setErrorKey] = useState<string | null>(null)
  const [roster, setRoster] = useState<CachedSessionPrimitive[]>(() =>
    authUseCases.getSavedAccounts.execute(),
  )
  const rootRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  const menuId = useId()

  const activeSession = authUseCases.getCurrentSessionSync.execute()
  const activeEmail = activeSession?.user.email ?? null
  const activeOrgId = activeSession?.organization?.id ?? ''

  const otherAccounts = useMemo(
    () =>
      roster.filter(
        (entry) =>
          !(entry.email === activeEmail && (entry.organizationId ?? '') === activeOrgId),
      ),
    [roster, activeEmail, activeOrgId],
  )

  useEffect(() => {
    if (variant === 'block') return
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
  }, [open, variant])

  useEffect(() => {
    return () => {
      if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    }
  }, [])

  function scheduleClose() {
    if (variant === 'block') return
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => {
      setOpen(false)
      closeTimer.current = null
    }, 250)
  }

  function cancelClose() {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  function refreshRoster() {
    setRoster(authUseCases.getSavedAccounts.execute())
  }

  async function handleSwitch(entry: CachedSessionPrimitive) {
    const key = entryKey(entry)
    setPendingKey(key)
    setErrorKey(null)
    const result = await authUseCases.switchAccount.execute(entry)
    if (result.ok) {
      window.location.reload()
      return
    }
    setPendingKey(null)
    if (result.reason === 'expired') {
      const target = `${getLocaleUrl('/login', locale)}?add=1&email=${encodeURIComponent(entry.email)}`
      window.location.href = target
      return
    }
    // network: mantén la activa, muestra error inline en la fila.
    refreshRoster()
    setErrorKey(key)
  }

  function handleRemove(entry: CachedSessionPrimitive) {
    authUseCases.removeSavedAccount.execute(entry.email, entry.organizationId)
    refreshRoster()
  }

  const addHref = `${getLocaleUrl('/login', locale)}?add=1`
  const large = variant === 'block'

  return (
    <div
      className={`account-menu account-menu--${variant} ${open ? 'is-open' : ''}`}
      ref={rootRef}
      onMouseEnter={() => {
        if (variant !== 'block') {
          cancelClose()
          setOpen(true)
        }
      }}
      onMouseLeave={scheduleClose}
    >
      {variant === 'inline' ? (
        <button
          type="button"
          className="account-menu__trigger header__account-btn btn btn--secondary btn--default"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={content.triggerAriaLabel}
          onClick={() => setOpen((v) => !v)}
          onFocus={cancelClose}
        >
          <CircleUser size={18} strokeWidth={2} aria-hidden />
          <span>{content.accountLabel}</span>
          <ChevronDown size={14} strokeWidth={2} aria-hidden className="account-menu__chev" />
        </button>
      ) : (
        <div className="account-menu__block-header">
          <CircleUser size={18} strokeWidth={2} aria-hidden />
          <span>{content.accountLabel}</span>
        </div>
      )}

      {(open || variant === 'block') && (
        <div
          id={menuId}
          role="menu"
          aria-label={content.menuAriaLabel}
          className="account-menu__panel"
        >
          {activeSession && (
            <div className="account-menu__row account-menu__row--active" role="none">
              <div className="account-menu__row-main" role="menuitem" aria-current="true">
                <AccountAvatar name={activeSession.user.name || activeSession.user.email} />
                <div className="account-menu__info">
                  <div className="account-menu__title-line">
                    <span className="account-menu__name">
                      {activeSession.user.name || activeSession.user.email}
                    </span>
                    <span className="account-menu__badge">{content.activeBadge}</span>
                  </div>
                  <span className="account-menu__org">
                    {activeSession.organization?.name || content.noOrg}
                  </span>
                </div>
              </div>
              {/* Único punto de entrada a /cuenta desde el header: sin este
                  enlace no hay forma de llegar a los ajustes de la cuenta. */}
              <a
                href={getLocaleUrl('/cuenta', locale)}
                className="account-menu__settings"
                role="menuitem"
                aria-label={content.settingsLabel}
                title={content.settingsLabel}
              >
                <Settings size={16} strokeWidth={2} aria-hidden />
              </a>
            </div>
          )}

          {otherAccounts.length > 0 && (
            <ul className="account-menu__list">
              {otherAccounts.map((entry, i) => {
                const key = entryKey(entry)
                const pending = pendingKey === key
                const displayName = entry.email
                const displayOrg = entry.organizationName || content.noOrg
                const switchLabel = fillTemplate(content.switchToAria, {
                  name: displayName,
                })
                const removeLabel = fillTemplate(content.removeAccountAria, {
                  name: displayName,
                })
                return (
                  <li key={key} role="none" style={{ '--acc-i': i } as CSSProperties}>
                    <div className="account-menu__row account-menu__row--switchable">
                      <button
                        type="button"
                        role="menuitem"
                        className="account-menu__switch"
                        disabled={pending}
                        aria-label={switchLabel}
                        onClick={() => handleSwitch(entry)}
                      >
                        <AccountAvatar name={displayName} />
                        <div className="account-menu__info">
                          <span className="account-menu__name">{displayName}</span>
                          <span className="account-menu__org">{displayOrg}</span>
                          {errorKey === key && (
                            <span className="account-menu__error">
                              {content.switchErrorLabel}
                            </span>
                          )}
                        </div>
                      </button>
                      <button
                        type="button"
                        className="account-menu__remove"
                        aria-label={removeLabel}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemove(entry)
                        }}
                      >
                        <Trash2 size={16} strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <div className="account-menu__footer">
            <a href={addHref} className="account-menu__add-link">
              <Button
                variant="ghost"
                size={large ? 'large' : 'default'}
                className="account-menu__add-btn"
              >
                <Plus size={16} strokeWidth={2} aria-hidden />
                {content.addNew}
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

function AccountAvatar({ name }: { name: string }) {
  return (
    <span className="account-menu__avatar" aria-hidden>
      {initials(name || '?').toUpperCase() || '?'}
    </span>
  )
}

function entryKey(entry: CachedSessionPrimitive): string {
  return `${entry.email}|${entry.organizationId ?? ''}`
}

function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`)
}
