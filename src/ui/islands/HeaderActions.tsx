import { useEffect, useState } from 'react'
import { CircleUser } from 'lucide-react'
import { authUseCases } from '../../modules/auth/application/factory'
import { Button } from '../components/Button/Button'
import { FreeTrialButton } from './FreeTrialButton'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'

interface HeaderActionsProps {
  locale: Locale
  variant?: 'inline' | 'block'
  /** Ruta actual sin prefijo de locale (p. ej. "/cuenta"), para marcar activo. */
  currentPath: string
  loginLabel: string
  ctaLabel: string
  accountLabel: string
}

/**
 * Acciones del header sensibles a la sesión.
 *
 * El header se renderiza en el servidor (SSG) y no conoce la sesión, que vive
 * en el cliente (localStorage). Esta isla resuelve el estado:
 * - Sin sesión → "Iniciar sesión" (ghost) + CTA de prueba (primary).
 * - Con sesión → un único botón "Mi cuenta" que lleva a /cuenta.
 *
 * Se monta como `client:only`, así que no hay HTML de servidor para esta isla:
 * el estado inicial se lee de forma SÍNCRONA (getCurrentUserSync) en el primer
 * render de cliente y el botón correcto se pinta directamente, sin el parpadeo
 * "Iniciar sesión → Mi cuenta" que daba la versión asíncrona.
 */
export function HeaderActions({
  locale,
  variant = 'inline',
  currentPath,
  loginLabel,
  ctaLabel,
  accountLabel,
}: HeaderActionsProps) {
  // Lectura síncrona en el primer render: como la isla es client:only, no hay
  // HTML de servidor con el que discrepar, así que este valor es autoritativo.
  const [authed, setAuthed] = useState<boolean>(
    () => authUseCases.getCurrentUserSync.execute() !== null,
  )

  // Tras F5 confirmamos con el backend que el token sigue vivo. Si lo rechaza,
  // el use case ya limpia la sesión persistida; aquí solo actualizamos la UI.
  useEffect(() => {
    if (!authed) return
    let cancelled = false
    authUseCases.verifyCurrentSession
      .execute()
      .then((session) => {
        if (!cancelled && session === null) setAuthed(false)
      })
      .catch(() => {
        // Fallo de red: mantenemos el estado optimista para no sacar al usuario
        // por un problema transitorio.
      })
    return () => {
      cancelled = true
    }
  }, [authed])
  const loginHref = getLocaleUrl('/login', locale)
  // La prueba gratis sin sesión arrastra el plan gratuito al login (?plan=free);
  // con sesión, FreeTrialButton hace el handoff al panel de KAI.
  const freeTrialLoginHref = getLocaleUrl('/login?plan=free', locale)
  const accountHref = getLocaleUrl('/cuenta', locale)
  const large = variant === 'block'
  const linkClass = large ? 'header__drawer-cta' : undefined
  const btnSize = large ? 'large' : 'default'
  // ¿Estamos en la página de cuenta? Marca el botón como activo.
  const onAccount = currentPath === '/cuenta' || currentPath.startsWith('/cuenta')

  if (authed) {
    const btnClass = ['header__account-btn', onAccount ? 'is-active' : '', linkClass ?? '']
      .filter(Boolean)
      .join(' ')
    return (
      <>
        <a href={accountHref} className={linkClass} aria-current={onAccount ? 'page' : undefined}>
          <Button variant="secondary" size={btnSize} className={btnClass}>
            <CircleUser size={18} strokeWidth={2} aria-hidden />
            {accountLabel}
          </Button>
        </a>
        <FreeTrialButton
          locale={locale}
          label={ctaLabel}
          loginHref={freeTrialLoginHref}
          size={btnSize}
          className={linkClass}
        />
      </>
    )
  }

  return (
    <>
      <a href={loginHref} className={linkClass}>
        <Button variant="ghost" size={btnSize} className={linkClass}>
          {loginLabel}
        </Button>
      </a>
      <FreeTrialButton
        locale={locale}
        label={ctaLabel}
        loginHref={freeTrialLoginHref}
        size={btnSize}
        className={linkClass}
      />
    </>
  )
}
