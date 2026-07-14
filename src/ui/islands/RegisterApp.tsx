import { useState, type FormEvent } from 'react'
import { AlertCircle } from 'lucide-react'
import { registrationUseCases } from '../../modules/registration/application/factory'
import { RegistrationData } from '../../modules/registration/domain/RegistrationData'
import { Button } from '../components/Button/Button'
import { COUNTRIES } from '../utils/countries'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import { REGISTER_PAGE_CONTENT } from '../pages/RegisterPage/content'
import { kaiPanelUrl } from '../../config/appUrls'
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
  country: string
  street: string
  city: string
  region: string
  postalCode: string
}

const INITIAL_STATE: FormState = {
  firstName: '',
  lastName: '',
  company: '',
  email: '',
  phone: '',
  country: 'ES',
  street: '',
  city: '',
  region: '',
  postalCode: '',
}

export function RegisterApp({ locale }: RegisterAppProps) {
  const { brand, form } = REGISTER_PAGE_CONTENT[locale]
  const [values, setValues] = useState<FormState>(INITIAL_STATE)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const data = RegistrationData.fromPrimitive(values)
      await registrationUseCases.register.execute(data)
      // Tras el alta, SIEMPRE al panel de frontend-kai (sin fallback local).
      window.location.href = kaiPanelUrl(locale)
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
                  {form.phoneLabel} <span className="register__required">*</span>
                </span>
                <input
                  type="tel"
                  className="register__input"
                  placeholder={form.phonePlaceholder}
                  value={values.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  autoComplete="tel"
                  required
                  disabled={submitting}
                />
              </label>
            </div>
          </fieldset>

          <fieldset className="register__section">
            <legend className="register__section-title">{form.sectionBilling}</legend>
            <div className="register__grid">
              <label className="register__field register__field--span2">
                <span className="register__label">
                  {form.countryLabel} <span className="register__required">*</span>
                </span>
                <select
                  className="register__input register__select"
                  value={values.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  autoComplete="country"
                  required
                  disabled={submitting}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="register__field register__field--span2">
                <span className="register__label">
                  {form.streetLabel} <span className="register__required">*</span>
                </span>
                <input
                  type="text"
                  className="register__input"
                  placeholder={form.streetPlaceholder}
                  value={values.street}
                  onChange={(e) => updateField('street', e.target.value)}
                  autoComplete="street-address"
                  required
                  disabled={submitting}
                />
              </label>

              <label className="register__field">
                <span className="register__label">
                  {form.cityLabel} <span className="register__required">*</span>
                </span>
                <input
                  type="text"
                  className="register__input"
                  placeholder={form.cityPlaceholder}
                  value={values.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  autoComplete="address-level2"
                  required
                  disabled={submitting}
                />
              </label>

              <label className="register__field">
                <span className="register__label">
                  {form.regionLabel} <span className="register__required">*</span>
                </span>
                <input
                  type="text"
                  className="register__input"
                  placeholder={form.regionPlaceholder}
                  value={values.region}
                  onChange={(e) => updateField('region', e.target.value)}
                  autoComplete="address-level1"
                  required
                  disabled={submitting}
                />
              </label>

              <label className="register__field register__field--span2">
                <span className="register__label">
                  {form.postalCodeLabel}{' '}
                  <span className="register__optional">{form.postalCodeOptional}</span>
                </span>
                <input
                  type="text"
                  className="register__input"
                  placeholder={form.postalCodePlaceholder}
                  value={values.postalCode}
                  onChange={(e) => updateField('postalCode', e.target.value)}
                  autoComplete="postal-code"
                  disabled={submitting}
                />
              </label>
            </div>
          </fieldset>

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
            <a href={getLocaleUrl('/login', locale)} className="register__login-link">
              {form.loginLink}
            </a>
          </p>

          <p className="register__hint">{form.prototypeHint}</p>
        </form>
      </div>
    </div>
  )
}
