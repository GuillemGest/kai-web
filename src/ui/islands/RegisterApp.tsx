import { useState, type FormEvent } from 'react'
import { AlertCircle, MailCheck } from 'lucide-react'
import { registrationUseCases } from '../../modules/registration/application/factory'
import { RegistrationData } from '../../modules/registration/domain/RegistrationData'
import { Button } from '../components/Button/Button'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import { REGISTER_PAGE_CONTENT } from '../pages/RegisterPage/content'
import { ORIGINS } from '../../config/appUrls'
import { pendingPlanQueryString } from '../utils/pendingPlanQuery'
import '../pages/RegisterPage/RegisterPage.css'

interface RegisterAppProps {
  locale: Locale
}

interface FormState {
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
  acceptsTerms: boolean
  acceptsNewsletter: boolean
}

const INITIAL_STATE: FormState = {
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  acceptsTerms: false,
  acceptsNewsletter: false,
}

export function RegisterApp({ locale }: RegisterAppProps) {
  const { brand, form } = REGISTER_PAGE_CONTENT[locale]
  const [values, setValues] = useState<FormState>(INITIAL_STATE)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Alta completada: se muestra el aviso de "revisa tu correo" sobre el formulario.
  const [sent, setSent] = useState(false)

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    // El form usa noValidate, así que el `required` nativo del checkbox no
    // bloquea el envío: los términos se comprueban aquí.
    if (!values.acceptsTerms) {
      setError(form.errorTermsRequired)
      return
    }
    setSubmitting(true)
    try {
      const data = RegistrationData.fromPrimitive(values)
      await registrationUseCases.register.execute(data)
      // El alta queda pendiente de confirmación por email: sin sesión ni
      // redirección. Se muestra el aviso con el siguiente paso.
      setSent(true)
    } catch {
      setError(form.errorGeneric)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="register">
      {/* Panel izquierdo — marca */}
      <div className="register__brand-panel">
        <div className="register__quote">
          <p className="register__quote-text">
            {brand.quoteLead}
            <em>{brand.quoteEmphasis}</em>
            {brand.quoteTail}
          </p>
          <p className="register__quote-meta">{brand.quoteMeta}</p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="register__form-panel">
        <form className="register__form" onSubmit={handleSubmit} noValidate>
          <h1 className="register__heading">{form.heading}</h1>
          <p className="register__sub">{form.subheading}</p>

          <fieldset className="register__section">
            <legend className="register__section-title">{form.sectionContact}</legend>
            <div className="register__grid">
              <label className="register__field">
                <span className="register__label">
                  {form.firstNameLabel} <span className="register__required">*</span>
                </span>
                <input
                  type="text"
                  className="register__input"
                  placeholder={form.firstNamePlaceholder}
                  value={values.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  autoComplete="given-name"
                  required
                  disabled={submitting}
                />
              </label>

              <label className="register__field">
                <span className="register__label">
                  {form.lastNameLabel} <span className="register__required">*</span>
                </span>
                <input
                  type="text"
                  className="register__input"
                  placeholder={form.lastNamePlaceholder}
                  value={values.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  autoComplete="family-name"
                  required
                  disabled={submitting}
                />
              </label>

              <label className="register__field register__field--span2">
                <span className="register__label">
                  {form.companyLabel}{' '}
                  <span className="register__optional">{form.companyOptional}</span>
                </span>
                <input
                  type="text"
                  className="register__input"
                  placeholder={form.companyPlaceholder}
                  value={values.company}
                  onChange={(e) => updateField('company', e.target.value)}
                  autoComplete="organization"
                  disabled={submitting}
                />
              </label>

              <label className="register__field">
                <span className="register__label">
                  {form.emailLabel} <span className="register__required">*</span>
                </span>
                <input
                  type="email"
                  className="register__input"
                  placeholder={form.emailPlaceholder}
                  value={values.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  autoComplete="email"
                  required
                  disabled={submitting}
                />
              </label>

              <label className="register__field">
                <span className="register__label">
                  {form.phoneLabel}{' '}
                  <span className="register__optional">{form.phoneOptional}</span>
                </span>
                <input
                  type="tel"
                  className="register__input"
                  placeholder={form.phonePlaceholder}
                  value={values.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  autoComplete="tel"
                  disabled={submitting}
                />
              </label>
            </div>
          </fieldset>

          <div className="register__consents">
            <label className="register__consent">
              <input
                type="checkbox"
                className="register__checkbox"
                checked={values.acceptsTerms}
                onChange={(e) => updateField('acceptsTerms', e.target.checked)}
                required
                disabled={submitting}
              />
              <span className="register__consent-text">
                {form.termsLabelLead}{' '}
                <a
                  href={ORIGINS.termsAndConditions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="register__consent-link"
                >
                  {form.termsLinkLabel}
                </a>{' '}
                <span className="register__required">*</span>
              </span>
            </label>

            <label className="register__consent">
              <input
                type="checkbox"
                className="register__checkbox"
                checked={values.acceptsNewsletter}
                onChange={(e) => updateField('acceptsNewsletter', e.target.checked)}
                disabled={submitting}
              />
              <span className="register__consent-text">{form.newsletterLabel}</span>
            </label>
          </div>

          {error && (
            <p className="register__error" role="alert">
              <AlertCircle size={15} strokeWidth={2} aria-hidden />
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="register__submit"
            disabled={submitting}
          >
            {submitting ? form.submitLoading : form.submitIdle}
          </Button>

          <p className="register__required-hint">{form.requiredHint}</p>

          <p className="register__login-prompt">
            {form.loginPrompt}{' '}
            {/* Conserva el plan pendiente (?plan=&seats=) al volver al login. */}
            <a
              href={`${getLocaleUrl('/login', locale)}${pendingPlanQueryString()}`}
              className="register__login-link"
            >
              {form.loginLink}
            </a>
          </p>

          <p className="register__hint">{form.prototypeHint}</p>
        </form>
      </div>

      {/* Aviso post-alta: correo de confirmación enviado. Sin botón de cierre:
          el alta ya está hecha y el único paso posible es confirmar el email. */}
      {sent && (
        <div className="register__modal-backdrop">
          <div
            className="register__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="register-sent-title"
          >
            <span className="register__modal-icon" aria-hidden>
              <MailCheck size={28} strokeWidth={2} />
            </span>
            <h2 id="register-sent-title" className="register__modal-title">
              {form.sentTitle}
            </h2>
            <p className="register__modal-body">
              {form.sentBodyLead} <strong>{values.email}</strong> {form.sentBodyTail}
            </p>
            <p className="register__modal-hint">{form.sentHint}</p>

            {/* ⚠️ PROVISIONAL (mientras no existe el envío real de correo): lleva
                al mismo destino que tendrá el enlace del email de confirmación.
                Arrastra el plan pendiente para retomar la compra tras confirmar. */}
            <a
              className="register__modal-dev-link"
              href={getLocaleUrl(
                `/confirmar-cuenta?email=${encodeURIComponent(values.email)}${pendingPlanQueryString().replace('?', '&')}`,
                locale,
              )}
            >
              {form.sentDevButton}
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
