import { useState, type FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { authUseCases } from '../../modules/auth/application/factory'
import { Button } from '../components/Button/Button'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import { LOGIN_PAGE_CONTENT } from '../pages/LoginPage/content'
import '../pages/LoginPage/LoginPage.css'

const POST_LOGIN_URL = 'https://kai.amplifysoft.io/es/chat'

interface LoginAppProps {
  locale: Locale
}

export function LoginApp({ locale }: LoginAppProps) {
  const { brand, form } = LOGIN_PAGE_CONTENT[locale]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await authUseCases.login.execute(email, password)
      window.location.href = POST_LOGIN_URL
    } catch {
      setError(form.errorInvalidCredentials)
    } finally {
      setSubmitting(false)
    }
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
      </div>
    </div>
  )
}
