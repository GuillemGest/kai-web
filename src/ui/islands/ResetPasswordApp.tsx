import { useEffect, useState, type FormEvent } from 'react'
import { AlertCircle, Check, CheckCircle2, X } from 'lucide-react'
import { registrationUseCases } from '../../modules/registration/application/factory'
import { WeakPasswordError } from '../../modules/registration/domain/WeakPasswordError'
import { Password, type PasswordRequirement } from '../../modules/registration/domain/Password'
import { Button } from '../components/Button/Button'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import { RESET_PASSWORD_PAGE_CONTENT } from '../pages/ResetPasswordPage/content'
import { pendingPlanQueryString } from '../utils/pendingPlanQuery'
// Reutiliza el mismo estilo que la página de crear contraseña: solo cambian los
// textos (content propio), no la maquetación.
import '../pages/ConfirmAccountPage/ConfirmAccountPage.css'

/**
 * Email de la cuenta cuya contraseña se restablece, del `?email=` de la URL. Lo
 * pone el enlace del correo de recuperación (hoy, el botón provisional).
 */
function emailFromQuery(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('email')
}

/** Segundos antes de redirigir al login tras restablecer la contraseña. */
const REDIRECT_DELAY_MS = 3000

/** Orden en que se listan los requisitos de contraseña en la UI. */
const PASSWORD_REQUIREMENTS: readonly PasswordRequirement[] = [
  'length',
  'uppercase',
  'lowercase',
  'number',
  'symbol',
]

interface ResetPasswordAppProps {
  locale: Locale
}

export function ResetPasswordApp({ locale }: ResetPasswordAppProps) {
  const { form, success } = RESET_PASSWORD_PAGE_CONTENT[locale]
  const [email] = useState<string | null>(emailFromQuery)
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  // Estado de cada requisito de la política (feedback en vivo bajo el campo).
  const requirements = Password.requirements(password)

  // Conserva el plan pendiente (?plan=&seats=): tras el login se retoma la compra.
  const loginHref = `${getLocaleUrl('/login', locale)}${pendingPlanQueryString()}`

  // Contraseña actualizada: redirección automática al login (sin sesión; el
  // login es manual). El botón de la vista de éxito permite ir sin esperar.
  useEffect(() => {
    if (!done) return
    const id = window.setTimeout(() => {
      window.location.href = loginHref
    }, REDIRECT_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [done, loginHref])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    // La política de contraseña se comprueba en el dominio (Password.isValid);
    // aquí la usamos para bloquear el envío con un mensaje localizado.
    if (!Password.isValid(password)) {
      setError(form.errorWeakPassword)
      return
    }
    if (password !== repeat) {
      setError(form.errorMismatch)
      return
    }
    setSubmitting(true)
    try {
      // PROVISIONAL: reutilizamos setPassword (establece la contraseña por email)
      // como stand-in del futuro caso de uso propio de auth (resetPassword).
      await registrationUseCases.setPassword.execute(email ?? '', password)
      setDone(true)
    } catch (err) {
      setError(err instanceof WeakPasswordError ? form.errorWeakPassword : form.errorGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
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
              aria-describedby="reset-password-requirements"
            />
          </label>

          {/* Requisitos de la contraseña: se marcan en vivo conforme se cumplen. */}
          {password.length > 0 && (
            <div className="confirm__requirements" id="reset-password-requirements">
              <p className="confirm__requirements-title">{form.requirementsTitle}</p>
              <ul className="confirm__requirements-list">
                {PASSWORD_REQUIREMENTS.map((req) => {
                  const met = requirements[req]
                  return (
                    <li
                      key={req}
                      className={`confirm__requirement${met ? ' confirm__requirement--met' : ''}`}
                    >
                      {met ? (
                        <Check size={14} strokeWidth={2.5} aria-hidden />
                      ) : (
                        <X size={14} strokeWidth={2.5} aria-hidden />
                      )}
                      {form.passwordRequirements[req]}
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

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
            <AlertCircle size={13} strokeWidth={2} aria-hidden />
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
