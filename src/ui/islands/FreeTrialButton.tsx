import { useState } from 'react'
import { Button } from '../components/Button/Button'
import { authUseCases } from '../../modules/auth/application/factory'
import { kaiPanelUrl } from '../../config/appUrls'
import type { Locale } from '../../i18n/locales'

interface FreeTrialButtonProps {
  locale: Locale
  label: string
  /** Destino cuando NO hay sesión: login arrastrando el plan free. */
  loginHref: string
  size?: 'default' | 'large'
  /** Clase extra para integrarlo en contenedores como el header (drawer). */
  className?: string
}

/**
 * CTA "Probar gratis" del hero, sensible a la sesión.
 *
 * El hero se renderiza en el servidor y no conoce la sesión (vive en el cliente).
 * Esta isla resuelve el destino al pulsar:
 *  - Con sesión → reemite la cookie SSO (preparePanelHandoff) y salta al panel de
 *    KAI (kai.amplifysoft.io/{locale}/chat). El handoff es imprescindible porque
 *    kai-web puede servirse bajo otro dominio (kaistories.io), donde la cookie de
 *    `.amplifysoft.io` no existe hasta que la reemitimos.
 *  - Sin sesión → login arrastrando el plan free (loginHref).
 *
 * La decisión se toma en el click (no en render) para no depender del estado de
 * hidratación: la sesión persistida se lee en ese momento.
 */
export function FreeTrialButton({
  locale,
  label,
  loginHref,
  size = 'large',
  className,
}: FreeTrialButtonProps) {
  const [busy, setBusy] = useState(false)

  async function handleClick() {
    if (busy) return
    setBusy(true)
    try {
      const hadSession = await authUseCases.preparePanelHandoff.execute()
      window.location.href = hadSession ? kaiPanelUrl(locale) : loginHref
    } catch {
      // Si el handoff falla (red, backend caído…), no bloqueamos al usuario:
      // caemos al login, que reconstruye la sesión y continúa el flujo.
      window.location.href = loginHref
    }
  }

  return (
    <Button
      variant="primary"
      size={size}
      className={className}
      onClick={handleClick}
      disabled={busy}
    >
      {label}
    </Button>
  )
}
