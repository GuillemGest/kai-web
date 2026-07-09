import { useState, type FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { authUseCases } from '../../modules/auth/application/factory'
import { Button } from '../components/Button/Button'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import { LOGIN_PAGE_CONTENT } from '../pages/LoginPage/content'
import '../pages/LoginPage/LoginPage.css'

interface LoginAppProps {
  locale: Locale
}

export function LoginApp({ locale }: LoginAppProps) {
  const { brand, form } = LOGIN_PAGE_CONTENT[locale]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  // Paso del login en dos fases: primero credenciales, luego el código (2FA).
  const [step, setStep] = useState<'credentials' | 'code'>('credentials')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Paso 1: valida credenciales y dispara el envío del código. No inicia sesión.
  async function handleCredentialsSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await authUseCases.login.execute(email, password)
      // Credenciales correctas: pasamos a pedir el código de verificación.
      setStep('code')
      setSubmitting(false)
    } catch {
      // Credenciales inválidas: mismo mensaje tanto si el email no existe como
      // si la contraseña no coincide (no revelamos qué cuentas están registradas).
      setError(form.errorInvalidCredentials)
      setSubmitting(false)
    }
  }

  // Paso 2: valida el código y, si es correcto, entra a la página de usuario.
  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await authUseCases.validateLoginCode.execute(email, code)
      window.location.href = getLocaleUrl(form.redirectAfterLogin, locale)
    } catch {
      setError(form.errorInvalidCode)
      setSubmitting(false)
    }
  }

  // Vuelve al paso de credenciales limpiando el estado del código.
  function handleBack() {
    setStep('credentials')
    setCode('')
    setError(null)
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

      {/* Panel derecho — formulario */}
      <div className="login__form-panel">
        {step === 'credentials' ? (
          <form className="login__form" onSubmit={handleCredentialsSubmit} noValidate>
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
                  disabled={submitting}
                />
              </label>

              <label className="login__field">
                <span className="login__label">{form.passwordLabel}</span>
                <input
                  type="password"
                  className="login__input"
                  placeholder={form.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  disabled={submitting}
                />
              </label>
            </div>

            {error && (
              <p className="login__error" role="alert">
                <AlertCircle size={15} strokeWidth={2} aria-hidden />
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

            <p className="login__register-prompt">
              {form.registerPrompt}{' '}
              <a href={getLocaleUrl('/registro', locale)} className="login__register-link">
                {form.registerLink}
              </a>
            </p>

            <p className="login__hint">{form.prototypeHint}</p>
          </form>
        ) : (
          <form className="login__form" onSubmit={handleCodeSubmit} noValidate>
            <h1 className="login__heading">{form.codeHeading}</h1>
            <p className="login__sub">{form.codeSubheading}</p>

            <div className="login__fields">
              <label className="login__field">
                <span className="login__label">{form.codeLabel}</span>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  className="login__input"
                  placeholder={form.codePlaceholder}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  autoFocus
                  disabled={submitting}
                />
              </label>
            </div>

            {error && (
              <p className="login__error" role="alert">
                <AlertCircle size={15} strokeWidth={2} aria-hidden />
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
              {submitting ? form.codeSubmitLoading : form.codeSubmitIdle}
            </Button>

            <button type="button" className="login__register-link" onClick={handleBack}>
              {form.codeBack}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
