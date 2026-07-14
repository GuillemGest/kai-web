import { useEffect, useState, type FormEvent } from 'react'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { registrationUseCases } from '../../modules/registration/application/factory'
import { WeakPasswordError } from '../../modules/registration/domain/WeakPasswordError'
import { Button } from '../components/Button/Button'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import { CONFIRM_ACCOUNT_PAGE_CONTENT } from '../pages/ConfirmAccountPage/content'
import { pendingPlanQueryString } from '../utils/pendingPlanQuery'
import '../pages/ConfirmAccountPage/ConfirmAccountPage.css'

/**
 * Email de la cuenta a confirmar, del `?email=` de la URL. Lo pone el enlace
 * del correo de confirmación (hoy, el botón provisional del popup de registro).
 */
function emailFromQuery(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('email')
}

/** Segundos antes de redirigir al login tras confirmar la cuenta. */
const REDIRECT_DELAY_MS = 3000

interface ConfirmAccountAppProps {
  locale: Locale
}

export function ConfirmAccountApp({ locale }: ConfirmAccountAppProps) {
  const { form, success } = CONFIRM_ACCOUNT_PAGE_CONTENT[locale]
  const [email] = useState<string | null>(emailFromQuery)
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  // Conserva el plan pendiente (?plan=&seats=): tras el login se retoma la compra.
  const loginHref = `${getLocaleUrl('/login', locale)}${pendingPlanQueryString()}`

  // Cuenta confirmada: redirección automática al login (sin sesión; el login
  // es manual). El botón de la vista de éxito permite ir sin esperar.
  useEffect(() => {
    if (!confirmed) return
    const id = window.setTimeout(() => {
      window.location.href = loginHref
    }, REDIRECT_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [confirmed, loginHref])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    if (password !== repeat) {
      setError(form.errorMismatch)
      return
    }
    setSubmitting(true)
    try {
      await registrationUseCases.setPassword.execute(email ?? '', password)
      setConfirmed(true)
    } catch (err) {
      setError(err instanceof WeakPasswordError ? form.errorWeakPassword : form.errorGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    return (
      <div className="confirm">
        <div className="confirm__card" role="status">
          <span className="confirm__icon" aria-hidden>
            <CheckCircle2 size={28} strokeWidth={2} />
          </span>
          <h1 className="confirm__heading">{success.title}</h1>
          <p className="confirm__sub">{success.body}</p>
          <p className="confirm__redirect-notice">{success.redirectNotice}</p>
          <a href={loginHref} className="confirm__cta-link">
            <Button variant="primary" size="large" className="confirm__submit">
              {success.cta}
            </Button>
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="confirm">
      <form className="confirm__card" onSubmit={handleSubmit} noValidate>
        <h1 className="confirm__heading">{form.heading}</h1>
        <p className="confirm__sub">
          {email ? (
            <>
              {form.subheadingLead} <strong>{email}</strong>
            </>
          ) : (
            form.subheadingFallback
          )}
        </p>

        <div className="confirm__fields">
          <label className="confirm__field">
            <span className="confirm__label">{form.passwordLabel}</span>
            <input
              type="password"
              className="confirm__input"
              placeholder={form.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              autoFocus
              disabled={submitting}
            />
          </label>

          <label className="confirm__field">
            <span className="confirm__label">{form.repeatLabel}</span>
            <input
              type="password"
              className="confirm__input"
              placeholder={form.repeatPlaceholder}
              value={repeat}
              onChange={(e) => setRepeat(e.target.value)}
              autoComplete="new-password"
              required
              disabled={submitting}
            />
          </label>
        </div>

        {error && (
          <p className="confirm__error" role="alert">
            <AlertCircle size={15} strokeWidth={2} aria-hidden />
            {error}
          </p>
        )}

        <Button
          type="submit"
          variant="primary"
          size="large"
          className="confirm__submit"
          disabled={submitting}
        >
          {submitting ? form.submitLoading : form.submitIdle}
        </Button>
      </form>
    </div>
  )
}
