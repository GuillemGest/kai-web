import { useState, type FormEvent } from 'react'
import { AlertCircle, Check, Building2, ArrowLeft } from 'lucide-react'
import { authUseCases } from '../../modules/auth/application/factory'
import type { LoginResult } from '../../modules/auth/domain/IAuthRepository'
import type { Organization } from '../../modules/auth/domain/Organization'
import { Button } from '../components/Button/Button'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import { LOGIN_PAGE_CONTENT } from '../pages/LoginPage/content'
import { startCheckout } from '../utils/startCheckout'
import '../pages/LoginPage/LoginPage.css'

/**
 * Si el usuario llegó al login desde un plan (`?plan=<id>`), tras autenticarse
 * se inicia el checkout de ese plan en lugar de ir a la página de cuenta.
 */
function pendingPlanId(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('plan')
}

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
  async function applyLoginResult(result: LoginResult) {
    if (result.kind === 'session') {
      redirectToApp()
      return
    }
    if (result.kind === 'select_org') {
      // Una sola organización: entra automáticamente sin mostrar picker.
      if (result.orgs.length === 1) {
        const only = result.orgs[0].id
        setSelectedOrg(only)
        try {
          const next = await authUseCases.login.execute(email, password, only)
          await applyLoginResult(next)
        } catch {
          setError(form.errorInvalidCredentials)
          setSubmitting(false)
        }
        return
      }
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
      await applyLoginResult(result)
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
      await applyLoginResult(result)
    } catch {
      setError(form.errorInvalidCredentials)
      setSubmitting(false)
    }
  }

  // Continúa el flujo una vez hay sesión (login normal o mock):
  //  - si venía un plan pendiente (?plan=<id>), inicia el checkout de Stripe,
  //  - si no, entra a la página de usuario.
  async function continueAfterAuth(userId: string, userEmail: string) {
    const planId = pendingPlanId()
    // Plan gratuito: no hay checkout de Stripe. Llevamos a la cuenta con un flag
    // (?trial=started) que dispara el aviso de prueba iniciada. Solo apariencia:
    // no se persiste ningún estado de prueba de momento.
    if (planId === 'free') {
      window.location.href = getLocaleUrl(`${form.redirectAfterLogin}?trial=started`, locale)
      return
    }
    if (planId) {
      // startCheckout redirige a Stripe; si lanza, lo gestiona quien llame.
      await startCheckout({ planId, period: 'monthly', userId, customerEmail: userEmail })
      return
    }
    window.location.href = getLocaleUrl(form.redirectAfterLogin, locale)
  }

  // Paso 2: valida el código (ValidateLoginCode también dispara set/cookie SSO)
  // y, si es correcto, continúa el flujo (checkout de plan pendiente o cuenta).
  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const session = await authUseCases.validateLoginCode.execute(
        email,
        code,
        password,
        selectedOrg,
      )
      await continueAfterAuth(session.user.id, session.user.email)
    } catch {
      setError(form.errorInvalidCode)
      setSubmitting(false)
    }
  }

  // ⚠️ PROVISIONAL (solo desarrollo): entra con una sesión mock, saltándose
  // credenciales y código, y continúa el flujo igual que un login real.
  async function handleMockLogin() {
    setError(null)
    setSubmitting(true)
    try {
      const session = await authUseCases.loginMock()
      await continueAfterAuth(session.user.id, session.user.email)
    } catch (err) {
      // Mostramos el error REAL (no el genérico de código) para poder depurar:
      // el fallo casi siempre es del checkout de Stripe, no del login mock.
      setError(err instanceof Error ? err.message : 'Error al entrar (mock).')
      setSubmitting(false)
    }
  }

  // Vuelve al paso de credenciales limpiando el estado del código.
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

            {/* ⚠️ PROVISIONAL (solo desarrollo): entra directo sin credenciales. */}
            <Button
              type="button"
              variant="secondary"
              size="large"
              className="login__submit"
              disabled={submitting}
              onClick={handleMockLogin}
            >
              Entrar (mock)
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

            <ul className="login__org-list" role="radiogroup" aria-label={form.orgSelectLabel}>
              {orgs.map((o) => {
                const checked = selectedOrg === o.id
                return (
                  <li key={o.id}>
                    <label className={`login__org-option${checked ? ' is-selected' : ''}`}>
                      <input
                        type="radio"
                        name="organization"
                        value={o.id}
                        checked={checked}
                        onChange={() => setSelectedOrg(o.id)}
                        disabled={submitting}
                        className="login__org-radio"
                      />
                      <span className="login__org-icon" aria-hidden>
                        <Building2 size={18} strokeWidth={2} />
                      </span>
                      <span className="login__org-name">{o.name}</span>
                      <span className="login__org-check" aria-hidden>
                        {checked && <Check size={16} strokeWidth={2.5} />}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>

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

            <button type="button" className="login__back" onClick={handleBack} disabled={submitting}>
              <ArrowLeft size={16} strokeWidth={2} aria-hidden />
              <span>{form.codeBack}</span>
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

            <button type="button" className="login__back" onClick={handleBack} disabled={submitting}>
              <ArrowLeft size={16} strokeWidth={2} aria-hidden />
              <span>{form.codeBack}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
