import { useState, type FormEvent } from 'react'
import { AlertCircle, MailCheck } from 'lucide-react'
import { registrationUseCases } from '../../modules/registration/application/factory'
import { RegistrationData } from '../../modules/registration/domain/RegistrationData'
import { Email } from '../../modules/registration/domain/Email'
import { PhoneNumber } from '../../modules/registration/domain/PhoneNumber'
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

// Campos con verificación de formato/obligatoriedad. `company` es libre y
// `acceptsTerms` se comprueba aparte al enviar.
const VALIDATED_FIELDS = ['firstName', 'lastName', 'email', 'phone'] as const
type ValidatedField = (typeof VALIDATED_FIELDS)[number]
type FieldErrors = Partial<Record<ValidatedField, string>>

function isValidatedField(field: keyof FormState): field is ValidatedField {
  return (VALIDATED_FIELDS as readonly string[]).includes(field)
}

type FieldMessages = (typeof REGISTER_PAGE_CONTENT)[Locale]['form']

// Devuelve el mensaje de error del campo, o undefined si es válido. La
// verificación de formato se delega en los value objects del dominio, de modo
// que la regla vive en un único sitio (Email/PhoneNumber).
function validateField(field: ValidatedField, value: string, form: FieldMessages): string | undefined {
  const trimmed = value.trim()
  switch (field) {
    case 'firstName':
      return trimmed ? undefined : form.errorFirstNameRequired
    case 'lastName':
      return trimmed ? undefined : form.errorLastNameRequired
    case 'email':
      if (!trimmed) return form.errorEmailRequired
      return Email.isValid(trimmed) ? undefined : form.errorEmailInvalid
    case 'phone':
      // Teléfono opcional: vacío es válido; con contenido, debe tener formato.
      if (!trimmed) return undefined
      return PhoneNumber.isValid(trimmed) ? undefined : form.errorPhoneInvalid
  }
}

export function RegisterApp({ locale }: RegisterAppProps) {
  const { brand, form } = REGISTER_PAGE_CONTENT[locale]
  const [values, setValues] = useState<FormState>(INITIAL_STATE)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // Errores de verificación por campo (se muestran bajo cada input).
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  // Alta completada: se muestra el aviso de "revisa tu correo" sobre el formulario.
  const [sent, setSent] = useState(false)

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
    // No mostramos errores mientras se escribe: la verificación se hace al salir
    // del campo (onBlur). Excepción: si el campo YA tiene un error visible, lo
    // reevaluamos en vivo para que desaparezca en cuanto el usuario lo corrige.
    if (isValidatedField(field) && typeof value === 'string' && fieldErrors[field]) {
      const message = validateField(field, value, form)
      setFieldErrors((prev) => ({ ...prev, [field]: message }))
    }
  }

  // Verifica el campo cuando el usuario lo abandona (onBlur).
  function handleBlur(field: ValidatedField) {
    const message = validateField(field, values[field], form)
    setFieldErrors((prev) => ({ ...prev, [field]: message }))
  }

  // Verifica todos los campos y vuelca los errores al estado. Devuelve true si
  // el formulario es válido.
  function validateAll(): boolean {
    const next: FieldErrors = {
      firstName: validateField('firstName', values.firstName, form),
      lastName: validateField('lastName', values.lastName, form),
      email: validateField('email', values.email, form),
      phone: validateField('phone', values.phone, form),
    }
    setFieldErrors(next)
    return !Object.values(next).some(Boolean)
  }

  // ⚠️ PROVISIONAL: rellena de golpe los campos que estén vacíos con datos de
  // ejemplo para agilizar las pruebas. Respeta lo que el usuario ya haya escrito.
  function fillGaps() {
    setError(null)
    setFieldErrors({})
    setValues((prev) => ({
      firstName: prev.firstName || 'Ana',
      lastName: prev.lastName || 'García',
      company: prev.company || 'Gestmusic',
      email: prev.email || 'ana.garcia@example.com',
      phone: prev.phone || '+34 600 000 000',
      acceptsTerms: true,
      acceptsNewsletter: prev.acceptsNewsletter,
    }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    // Verificación de formato/obligatoriedad de cada campo antes de enviar.
    if (!validateAll()) {
      return
    }
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

  // Props e indicador de error reutilizables para cada input verificado.
  function fieldErrorProps(field: ValidatedField) {
    const message = fieldErrors[field]
    return {
      className: `register__input${message ? ' register__input--error' : ''}`,
      'aria-invalid': message ? true : undefined,
      'aria-describedby': message ? `register-error-${field}` : undefined,
    }
  }

  function renderFieldError(field: ValidatedField) {
    const message = fieldErrors[field]
    if (!message) return null
    return (
      <span id={`register-error-${field}`} className="register__field-error" role="alert">
        <AlertCircle size={13} strokeWidth={2} aria-hidden />
        {message}
      </span>
    )
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
                  {...fieldErrorProps('firstName')}
                  placeholder={form.firstNamePlaceholder}
                  value={values.firstName}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  autoComplete="given-name"
                  required
                  disabled={submitting}
                />
                {renderFieldError('firstName')}
              </label>

              <label className="register__field">
                <span className="register__label">
                  {form.lastNameLabel} <span className="register__required">*</span>
                </span>
                <input
                  type="text"
                  {...fieldErrorProps('lastName')}
                  placeholder={form.lastNamePlaceholder}
                  value={values.lastName}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  autoComplete="family-name"
                  required
                  disabled={submitting}
                />
                {renderFieldError('lastName')}
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
                  {...fieldErrorProps('email')}
                  placeholder={form.emailPlaceholder}
                  value={values.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                  autoComplete="email"
                  required
                  disabled={submitting}
                />
                {renderFieldError('email')}
              </label>

              <label className="register__field">
                <span className="register__label">
                  {form.phoneLabel}{' '}
                  <span className="register__optional">{form.phoneOptional}</span>
                </span>
                <input
                  type="tel"
                  {...fieldErrorProps('phone')}
                  placeholder={form.phonePlaceholder}
                  value={values.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  autoComplete="tel"
                  disabled={submitting}
                />
                {renderFieldError('phone')}
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
              <AlertCircle size={13} strokeWidth={2} aria-hidden />
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

          {/* ⚠️ PROVISIONAL (solo en desarrollo): autocompleta los campos vacíos
              con datos de ejemplo. No se incluye en el build de producción. */}
          {import.meta.env.DEV && (
            <Button
              type="button"
              variant="secondary"
              size="small"
              className="register__fill-gaps"
              onClick={fillGaps}
              disabled={submitting}
            >
              {form.fillGapsButton}
            </Button>
          )}

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
