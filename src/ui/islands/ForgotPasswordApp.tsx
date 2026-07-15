import { useState, type FormEvent } from 'react'
import { AlertCircle, ArrowLeft, MailCheck } from 'lucide-react'
import { Email } from '../../modules/registration/domain/Email'
import { Button } from '../components/Button/Button'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import { FORGOT_PASSWORD_PAGE_CONTENT } from '../pages/ForgotPasswordPage/content'
import { pendingPlanQueryString } from '../utils/pendingPlanQuery'
import '../pages/LoginPage/LoginPage.css'
import '../pages/ForgotPasswordPage/ForgotPasswordPage.css'

interface ForgotPasswordAppProps {
  locale: Locale
}

export function ForgotPasswordApp({ locale }: ForgotPasswordAppProps) {
  const { brand, form, sent: sentCopy } = FORGOT_PASSWORD_PAGE_CONTENT[locale]
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  // Solicitud enviada: se muestra el aviso de "revisa tu correo".
  const [sent, setSent] = useState(false)

  // Enlace a login conservando el plan pendiente (?plan=&seats=).
  const loginHref = `${getLocaleUrl('/login', locale)}${pendingPlanQueryString()}`

  // ⚠️ PROVISIONAL: mismo destino que tendrá el enlace del correo de
  // recuperación — la página de restablecer contraseña. Arrastra el plan
  // pendiente para no perder la compra en curso.
  const resetLinkHref = getLocaleUrl(
    `/restablecer-contrasena?email=${encodeURIComponent(email.trim())}${pendingPlanQueryString().replace('?', '&')}`,
    locale,
  )

  // La verificación de formato se delega en el value object del dominio, de modo
  // que la regla vive en un único sitio (Email).
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = email.trim()
    if (!trimmed) {
      setError(form.errorEmailRequired)
      return
    }
    if (!Email.isValid(trimmed)) {
      setError(form.errorEmailInvalid)
      return
    }
    setError(null)
    setSubmitting(true)
    // Sin envío real de correo todavía: mostramos directamente el aviso. Cuando
    // exista el caso de uso real, aquí se invocará antes de marcar `sent`.
    setSent(true)
    setSubmitting(false)
  }

  return (
    <div className="login">
      {/* Panel izquierdo — marca */}
      <div className="login__brand-panel">
        <div className="login__quote">
          <p className="login__quote-text">
            {brand.quoteLead}
            <em>{brand.quoteEmphasis}</em>
            {brand.quoteTail}
          </p>
          <p className="login__quote-meta">{brand.quoteMeta}</p>
        </div>
      </div>

      {/* Panel derecho — formulario o aviso de envío */}
      <div className="login__form-panel">
        {sent ? (
          <div className="forgot__sent" role="status">
            <span className="forgot__sent-icon" aria-hidden>
              <MailCheck size={28} strokeWidth={2} />
            </span>
            <h1 className="login__heading">{sentCopy.title}</h1>
            <p className="login__sub">
              {sentCopy.bodyLead} <strong>{email.trim()}</strong> {sentCopy.bodyTail}
            </p>
            <p className="forgot__sent-hint">{sentCopy.hint}</p>

            {/* ⚠️ PROVISIONAL: simula el enlace del correo de recuperación. */}
            <a className="forgot__dev-link" href={resetLinkHref}>
              {sentCopy.devButton}
            </a>

            <a className="login__back forgot__back" href={loginHref}>
              <ArrowLeft size={16} strokeWidth={2} aria-hidden />
              <span>{form.backToLogin}</span>
            </a>
          </div>
        ) : (
          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <h1 className="login__heading">{form.heading}</h1>
            <p className="login__sub">{form.subheading}</p>

            <div className="login__fields">
              <label className="login__field">
                <span className="login__label">{form.emailLabel}</span>
                <input
                  type="email"
                  className="login__input"
                  placeholder={form.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  autoFocus
                  disabled={submitting}
                />
              </label>
            </div>

            {error && (
              <p className="login__error" role="alert">
                <AlertCircle size={13} strokeWidth={2} aria-hidden />
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              className="login__submit"
              disabled={submitting}
            >
              {submitting ? form.submitLoading : form.submitIdle}
            </Button>

            <a className="login__back forgot__back" href={loginHref}>
              <ArrowLeft size={16} strokeWidth={2} aria-hidden />
              <span>{form.backToLogin}</span>
            </a>
          </form>
        )}
      </div>
    </div>
  )
}
