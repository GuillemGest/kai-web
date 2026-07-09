import { useState, type FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { authUseCases } from '../../modules/auth/application/factory'
import type { LoginResult } from '../../modules/auth/domain/IAuthRepository'
import type { Organization } from '../../modules/auth/domain/Organization'
import { Button } from '../components/Button/Button'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import { LOGIN_PAGE_CONTENT } from '../pages/LoginPage/content'
import '../pages/LoginPage/LoginPage.css'

interface LoginAppProps {
  locale: Locale
}

type Step = 'credentials' | 'select_org' | 'code'

export function LoginApp({ locale }: LoginAppProps) {
  const { brand, form } = LOGIN_PAGE_CONTENT[locale]
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  // Paso del login: credenciales → (posible selección de org) → código (2FA) → sesión.
  const [step, setStep] = useState<Step>('credentials')
  const [orgs, setOrgs] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string | undefined>(undefined)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function redirectToApp() {
    window.location.href = getLocaleUrl(form.redirectAfterLogin, locale)
  }

  // Aplica el resultado del login a la máquina de estados.
  function applyLoginResult(result: LoginResult) {
    if (result.kind === 'session') {
      redirectToApp()
      return
    }
    if (result.kind === 'select_org') {
      setOrgs(result.orgs)
      setStep('select_org')
      setSubmitting(false)
      return
    }
    setStep('code')
    setSubmitting(false)
  }

  // Paso 1: valida credenciales. Puede saltar a org-select, código, o sesión directa.
  async function handleCredentialsSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const result = await authUseCases.login.execute(email, password, selectedOrg)
      applyLoginResult(result)
    } catch {
      setError(form.errorInvalidCredentials)
      setSubmitting(false)
    }
  }

  // Paso intermedio: reenvía el login con la organización elegida.
  async function handleOrgSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    if (!selectedOrg) {
      setError(form.errorNoOrgSelected)
      return
    }
    setSubmitting(true)
    try {
      const result = await authUseCases.login.execute(email, password, selectedOrg)
      applyLoginResult(result)
    } catch {
      setError(form.errorInvalidCredentials)
      setSubmitting(false)
    }
  }

  // Paso 2: valida el código; ValidateLoginCode también dispara set/cookie SSO.
  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await authUseCases.validateLoginCode.execute(email, code, password, selectedOrg)
      redirectToApp()
    } catch {
      setError(form.errorInvalidCode)
      setSubmitting(false)
    }
  }

  function handleBack() {
    setStep('credentials')
    setCode('')
    setOrgs([])
    setSelectedOrg(undefined)
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
        {step === 'credentials' && (
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
        )}

        {step === 'select_org' && (
          <form className="login__form" onSubmit={handleOrgSubmit} noValidate>
            <h1 className="login__heading">{form.orgSelectHeading}</h1>
            <p className="login__sub">{form.orgSelectSubheading}</p>

            <div className="login__fields" role="radiogroup" aria-label={form.orgSelectLabel}>
              {orgs.map((o) => (
                <label key={o.id} className="login__field">
                  <input
                    type="radio"
                    name="organization"
                    value={o.id}
                    checked={selectedOrg === o.id}
                    onChange={() => setSelectedOrg(o.id)}
                    disabled={submitting}
                  />
                  <span className="login__label">{o.name}</span>
                </label>
              ))}
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
              disabled={submitting || !selectedOrg}
            >
              {submitting ? form.orgSelectSubmitLoading : form.orgSelectSubmitIdle}
            </Button>

            <button type="button" className="login__register-link" onClick={handleBack}>
              {form.codeBack}
            </button>
          </form>
        )}

        {step === 'code' && (
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
