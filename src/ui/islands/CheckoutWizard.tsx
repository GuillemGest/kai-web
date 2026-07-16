import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { AlertCircle, ArrowLeft, Check, Lock, Minus, Plus } from 'lucide-react'
import type { Locale } from '../../i18n/locales'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import { authUseCases } from '../../modules/auth/application/factory'
import { billingUseCases } from '../../modules/billing/application/factory'
import { EXTRA_SEAT_PRICE_MONTH, Plan } from '../../modules/billing/domain/Plan'
import {
  BILLING_FIELD_VALIDATORS,
  type BillingDetailsField,
  type BillingDetailsPrimitive,
} from '../../modules/billing/domain/BillingDetails'
import type { PlanId } from '../../modules/content/domain/types'
import { Button } from '../components/Button/Button'
import { localizePlan } from '../utils/localizePlan'
import { pendingPlanFromQuery } from '../utils/pendingPlanQuery'
import { startCheckout, CheckoutError } from '../utils/startCheckout'
import { CHECKOUT_PAGE_CONTENT } from '../pages/CheckoutPage/content'
import { PLAN_TRANSLATIONS } from '../pages/ShopPage/content'
import '../pages/CheckoutPage/CheckoutPage.css'

type Step = 'plan' | 'billing' | 'payment'
type LoadState = 'loading' | 'ready' | 'error'

// Planes comprables desde el wizard (mismo trío que el grid de /planes).
const WIZARD_PLAN_IDS: readonly PlanId[] = ['audioPro', 'fullPro', 'team']
const DEFAULT_PLAN_ID: PlanId = 'fullPro'
// Datos del paso 2 en sessionStorage: sobreviven al ir/volver de Stripe en la
// misma pestaña sin persistir datos fiscales entre sesiones de navegador.
const BILLING_STORAGE_KEY = 'kai.checkout.billing'

const EMPTY_BILLING: BillingDetailsPrimitive = {
  legalName: '',
  taxId: '',
  billingEmail: '',
  addressLine: '',
  city: '',
  postalCode: '',
  province: '',
  country: 'ES',
}

/**
 * ⚠️ PROVISIONAL: datos de ejemplo para el botón de autorrelleno del paso 2
 * (acelera las pruebas manuales). Retirar junto con el botón al cerrar la demo.
 * El NIF pasa el patrón laxo del dominio; el email se sustituye por el de la
 * sesión al rellenar si está disponible.
 */
const DEV_FILL_BILLING: BillingDetailsPrimitive = {
  legalName: 'Amplify Demo SL',
  taxId: 'B12345678',
  billingEmail: 'facturas@demo.kai',
  addressLine: 'Carrer de la Prova, 42',
  city: 'Barcelona',
  postalCode: '08001',
  province: 'Barcelona',
  country: 'ES',
}

const BILLING_FIELD_ORDER: readonly BillingDetailsField[] = [
  'legalName',
  'taxId',
  'billingEmail',
  'addressLine',
  'city',
  'postalCode',
  'province',
  'country',
]

/** Autocomplete HTML por campo (mejor UX de relleno en navegadores). */
const BILLING_AUTOCOMPLETE: Record<BillingDetailsField, string> = {
  legalName: 'organization',
  taxId: 'off',
  billingEmail: 'email',
  addressLine: 'street-address',
  city: 'address-level2',
  postalCode: 'postal-code',
  province: 'address-level1',
  country: 'country',
}

function fill(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (acc, [key, value]) => acc.replaceAll(`{${key}}`, String(value)),
    template,
  )
}

function requestedPlanId(): PlanId {
  const raw = pendingPlanFromQuery()?.planId
  return WIZARD_PLAN_IDS.includes(raw as PlanId) ? (raw as PlanId) : DEFAULT_PLAN_ID
}

function requestedSeats(): number {
  return pendingPlanFromQuery()?.seats ?? 0
}

function readStoredBilling(): BillingDetailsPrimitive | null {
  try {
    const raw = sessionStorage.getItem(BILLING_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<BillingDetailsPrimitive>
    return { ...EMPTY_BILLING, ...parsed }
  } catch {
    return null
  }
}

interface CheckoutWizardProps {
  locale: Locale
}

/**
 * Wizard de compra en 3 pasos: plan (con usuarios extra), datos de facturación
 * y pago (redirección a Stripe hosted checkout). Requiere sesión: sin ella se
 * redirige al login arrastrando `?plan=&seats=` para retomar la compra.
 *
 * El precio mostrado (base + N × EXTRA_SEAT_PRICE_MONTH) es informativo: las
 * líneas de cobro reales las construye el servidor con los precios de Stripe.
 */
export function CheckoutWizard({ locale }: CheckoutWizardProps) {
  const content = CHECKOUT_PAGE_CONTENT[locale]
  const planTranslations = PLAN_TRANSLATIONS[locale]

  // Lectura síncrona de la sesión (patrón HeaderActions): la isla es
  // client:only, así que este valor es autoritativo en el primer render.
  const [user] = useState(() => authUseCases.getCurrentUserSync.execute())

  const [plans, setPlans] = useState<Plan[]>([])
  const [loadState, setLoadState] = useState<LoadState>('loading')
  const [step, setStep] = useState<Step>('plan')
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>(() => requestedPlanId())
  const [seats, setSeats] = useState<number>(() => requestedSeats())
  const [billing, setBilling] = useState<BillingDetailsPrimitive>(() => {
    const stored = typeof window === 'undefined' ? null : readStoredBilling()
    if (stored) return stored
    const email = authUseCases.getCurrentUserSync.execute()?.email ?? ''
    // Prefill razonable: el email de la cuenta suele ser también el de facturas.
    return { ...EMPTY_BILLING, billingEmail: email }
  })
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<BillingDetailsField, boolean>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [payError, setPayError] = useState<string | null>(null)
  // Límite de una suscripción por cuenta: la cuenta ya tiene una activa. Se
  // distingue del error genérico para ofrecer el enlace a gestionarla en vez
  // de solo un mensaje de "reinténtalo".
  const [subscriptionLimitHit, setSubscriptionLimitHit] = useState(false)

  const loginUrl = `${getLocaleUrl('/login', locale)}?plan=${selectedPlanId}${seats > 0 ? `&seats=${seats}` : ''}`

  // Guard de sesión: sin usuario no hay checkout; al login llevando el contexto.
  useEffect(() => {
    if (!user) {
      window.location.href = loginUrl
      return
    }
    // Tras F5 confirmamos con el backend que el token sigue vivo. Si lo
    // rechaza, el use case ya limpia la sesión persistida.
    let cancelled = false
    authUseCases.verifyCurrentSession
      .execute()
      .then((session) => {
        if (!cancelled && session === null) window.location.href = loginUrl
      })
      .catch(() => {
        // Fallo de red: estado optimista; el pago fallaría después de todos modos.
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  function loadPlans() {
    setLoadState('loading')
    billingUseCases.getPlans
      .execute()
      .then((result) => {
        setPlans(result)
        setLoadState('ready')
      })
      .catch(() => setLoadState('error'))
  }

  useEffect(() => {
    if (!user) return
    let active = true
    billingUseCases.getPlans
      .execute()
      .then((result) => {
        if (!active) return
        setPlans(result)
        setLoadState('ready')
      })
      .catch(() => active && setLoadState('error'))
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const wizardPlans = useMemo(
    () =>
      WIZARD_PLAN_IDS.map((id) => plans.find((p) => p.id === id))
        .filter((p): p is Plan => Boolean(p))
        .map((p) => localizePlan(p, planTranslations)),
    [plans, planTranslations],
  )

  const selectedPlan = wizardPlans.find((p) => p.id === selectedPlanId) ?? null
  // Asientos efectivos: siempre dentro de los límites del plan seleccionado
  // (la URL puede traer un valor fuera de rango).
  const effectiveSeats = selectedPlan ? Math.min(seats, selectedPlan.maxExtraSeats) : seats
  const totalPrice = selectedPlan?.totalPriceMonth(effectiveSeats) ?? null
  const currencySymbol =
    selectedPlan && selectedPlan.currency !== 'EUR' ? selectedPlan.currency : '€'

  // La URL refleja plan y asientos para sobrevivir a refresh, login y cancel
  // de Stripe sin estado servidor.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    params.set('plan', selectedPlanId)
    if (effectiveSeats > 0) params.set('seats', String(effectiveSeats))
    else params.delete('seats')
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`)
  }, [selectedPlanId, effectiveSeats])

  function handleSelectPlan(plan: Plan) {
    setSelectedPlanId(plan.id as PlanId)
    // Al cambiar de plan se recorta el exceso de asientos al nuevo máximo.
    setSeats((current) => Math.min(current, plan.maxExtraSeats))
  }

  function updateBillingField(field: BillingDetailsField, value: string) {
    setBilling((prev) => ({ ...prev, [field]: value }))
    setFieldErrors((prev) => ({ ...prev, [field]: false }))
  }

  // ⚠️ PROVISIONAL: rellena el paso 2 con datos de prueba para agilizar QA.
  function handleDevFill() {
    setBilling({
      ...DEV_FILL_BILLING,
      billingEmail: user?.email ?? DEV_FILL_BILLING.billingEmail,
    })
    setFieldErrors({})
  }

  // Paso 2: valida los 8 campos con las MISMAS reglas que el value object del
  // dominio (BILLING_FIELD_VALIDATORS) y persiste para sobrevivir navegaciones.
  function handleBillingSubmit(event: FormEvent) {
    event.preventDefault()
    const errors: Partial<Record<BillingDetailsField, boolean>> = {}
    for (const field of BILLING_FIELD_ORDER) {
      if (!BILLING_FIELD_VALIDATORS[field](billing[field].trim())) errors[field] = true
    }
    setFieldErrors(errors)
    if (Object.values(errors).some(Boolean)) return
    try {
      sessionStorage.setItem(BILLING_STORAGE_KEY, JSON.stringify(billing))
    } catch {
      // Sin sessionStorage (modo privado restrictivo) el wizard sigue funcionando.
    }
    setStep('payment')
  }

  // Paso 3: pide la sesión de Stripe al servidor y redirige a la pasarela.
  async function handlePay() {
    if (!user || !selectedPlan) return
    setPayError(null)
    setSubscriptionLimitHit(false)
    setSubmitting(true)
    try {
      await startCheckout({
        planId: selectedPlan.id,
        period: 'monthly',
        seats: effectiveSeats,
        userId: user.id,
        email: user.email,
        billingDetails: billing,
        locale,
      })
      // Redirección en marcha: los datos fiscales ya viajaron a Stripe.
      sessionStorage.removeItem(BILLING_STORAGE_KEY)
    } catch (error) {
      if (error instanceof CheckoutError && error.code === 'SUBSCRIPTION_LIMIT_EXCEEDED') {
        setPayError(content.payment.errorSubscriptionLimit)
        setSubscriptionLimitHit(true)
      } else {
        setPayError(content.payment.errorGeneric)
      }
      setSubmitting(false)
    }
  }

  // Sin sesión: el useEffect ya está redirigiendo al login; no pintamos nada.
  if (!user) return null

  const steps: readonly { id: Step; label: string }[] = [
    { id: 'plan', label: content.steps.plan },
    { id: 'billing', label: content.steps.billing },
    { id: 'payment', label: content.steps.payment },
  ]
  const stepIndex = steps.findIndex((s) => s.id === step)

  return (
    <main className="checkout">
      <header className="checkout__header">
        <h1 className="checkout__heading">{content.heading}</h1>
        <p className="checkout__subheading">{content.subheading}</p>
      </header>

      {/* Stepper: número + etiqueta, con estado hecho/activo/pendiente. */}
      <ol className="checkout__steps">
        {steps.map((s, i) => {
          const state = i < stepIndex ? 'is-done' : i === stepIndex ? 'is-active' : ''
          return (
            <li
              key={s.id}
              className={`checkout__step ${state}`}
              aria-current={i === stepIndex ? 'step' : undefined}
            >
              <span className="checkout__step-number" aria-hidden>
                {i < stepIndex ? <Check size={14} strokeWidth={3} /> : i + 1}
              </span>
              <span className="checkout__step-label">{s.label}</span>
            </li>
          )
        })}
      </ol>

      {loadState === 'loading' && <p className="checkout__loading">{content.loading}</p>}

      {loadState === 'error' && (
        <div className="checkout__error" role="alert">
          <p>{content.error.message}</p>
          <button type="button" className="checkout__retry" onClick={loadPlans}>
            {content.error.retry}
          </button>
        </div>
      )}

      {loadState === 'ready' && selectedPlan && (
        <>
          {step === 'plan' && (
            <section className="checkout__panel">
              <h2 className="checkout__panel-title">{content.plan.title}</h2>
              <p className="checkout__panel-sub">{content.plan.subtitle}</p>

              {/* Selector de plan: el plan que se intenta comprar, modificable. */}
              <ul className="checkout__plan-list" role="radiogroup" aria-label={content.plan.title}>
                {wizardPlans.map((plan) => {
                  const checked = plan.id === selectedPlanId
                  return (
                    <li key={plan.id}>
                      <label className={`checkout__plan-option${checked ? ' is-selected' : ''}`}>
                        <input
                          type="radio"
                          name="checkout-plan"
                          value={plan.id}
                          checked={checked}
                          onChange={() => handleSelectPlan(plan)}
                          className="checkout__plan-radio"
                        />
                        <span className="checkout__plan-name">{plan.name}</span>
                        <span className="checkout__plan-capacity">{plan.capacity}</span>
                        <span className="checkout__plan-price">
                          {plan.priceMonth} {currencySymbol}
                          <span className="checkout__plan-period">
                            {content.plan.pricePeriodMonth}
                          </span>
                        </span>
                        <span className="checkout__plan-check" aria-hidden>
                          {checked && <Check size={16} strokeWidth={2.5} />}
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>

              {/* Usuarios adicionales: +10 €/mes cada uno, hasta el máximo del plan. */}
              <div className="checkout__seats">
                <div className="checkout__seats-info">
                  <span className="checkout__seats-label">{content.plan.extraSeatsLabel}</span>
                  <span className="checkout__seats-hint">
                    {content.plan.includedUserNote}
                    {' · '}
                    {selectedPlan.maxExtraSeats === 0
                      ? content.plan.extraSeatsNone
                      : `${fill(content.plan.extraSeatsHint, { price: EXTRA_SEAT_PRICE_MONTH })} ${fill(content.plan.extraSeatsMax, { max: selectedPlan.maxExtraSeats })}`}
                  </span>
                </div>
                <div className="checkout__seats-stepper">
                  <button
                    type="button"
                    className="checkout__seats-btn"
                    onClick={() => setSeats(Math.max(0, effectiveSeats - 1))}
                    disabled={effectiveSeats <= 0}
                    aria-label={content.plan.seatsDecreaseAria}
                  >
                    <Minus size={16} strokeWidth={2.5} aria-hidden />
                  </button>
                  <span className="checkout__seats-count" aria-live="polite">
                    {effectiveSeats}
                  </span>
                  <button
                    type="button"
                    className="checkout__seats-btn"
                    onClick={() => setSeats(Math.min(selectedPlan.maxExtraSeats, effectiveSeats + 1))}
                    disabled={effectiveSeats >= selectedPlan.maxExtraSeats}
                    aria-label={content.plan.seatsIncreaseAria}
                  >
                    <Plus size={16} strokeWidth={2.5} aria-hidden />
                  </button>
                </div>
              </div>

              {/* Desglose y total en vivo. */}
              <dl className="checkout__summary">
                <div className="checkout__summary-row">
                  <dt>{fill(content.plan.summaryBaseLabel, { name: selectedPlan.name })}</dt>
                  <dd>
                    {selectedPlan.priceMonth} {currencySymbol}
                    {content.plan.pricePeriodMonth}
                  </dd>
                </div>
                {effectiveSeats > 0 && (
                  <div className="checkout__summary-row">
                    <dt>{fill(content.plan.summarySeatsLabel, { count: effectiveSeats })}</dt>
                    <dd>
                      {effectiveSeats * EXTRA_SEAT_PRICE_MONTH} {currencySymbol}
                      {content.plan.pricePeriodMonth}
                    </dd>
                  </div>
                )}
                <div className="checkout__summary-row checkout__summary-row--total">
                  <dt>{content.plan.totalLabel}</dt>
                  <dd>
                    {totalPrice} {currencySymbol}
                    {content.plan.pricePeriodMonth}
                  </dd>
                </div>
              </dl>

              <div className="checkout__actions">
                <Button
                  variant="primary"
                  size="large"
                  className="checkout__continue"
                  onClick={() => setStep('billing')}
                >
                  {content.plan.continue}
                </Button>
              </div>
            </section>
          )}

          {step === 'billing' && (
            <section className="checkout__panel">
              <h2 className="checkout__panel-title">{content.billing.title}</h2>
              <p className="checkout__panel-sub">{content.billing.subtitle}</p>

              {/* ⚠️ PROVISIONAL: autorrelleno de pruebas (mismo patrón que el
                  enlace dev del registro). Retirar al cerrar la demo. */}
              <button type="button" className="checkout__dev-fill" onClick={handleDevFill}>
                {content.billing.devFillButton}
              </button>

              <form className="checkout__form" onSubmit={handleBillingSubmit} noValidate>
                <div className="checkout__form-grid">
                  {BILLING_FIELD_ORDER.map((field) => {
                    const copy = content.billing.fields[field]
                    const hasError = Boolean(fieldErrors[field])
                    const inputId = `checkout-${field}`
                    return (
                      <div
                        key={field}
                        className={`checkout__field${field === 'legalName' || field === 'addressLine' ? ' checkout__field--span2' : ''}`}
                      >
                        <label className="checkout__label" htmlFor={inputId}>
                          {copy.label} <span className="checkout__required">*</span>
                        </label>
                        {field === 'country' ? (
                          <select
                            id={inputId}
                            className={`checkout__input${hasError ? ' has-error' : ''}`}
                            value={billing.country}
                            onChange={(e) => updateBillingField('country', e.target.value)}
                            autoComplete={BILLING_AUTOCOMPLETE.country}
                            required
                          >
                            {content.billing.countryOptions.map((option) => (
                              <option key={option.code} value={option.code}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        ) : field === 'billingEmail' ? (
                          <input
                            id={inputId}
                            type="email"
                            className="checkout__input checkout__input--readonly"
                            value={billing.billingEmail}
                            autoComplete={BILLING_AUTOCOMPLETE.billingEmail}
                            readOnly
                            aria-describedby={`${inputId}-hint`}
                          />
                        ) : (
                          <input
                            id={inputId}
                            type="text"
                            className={`checkout__input${hasError ? ' has-error' : ''}`}
                            placeholder={'placeholder' in copy ? copy.placeholder : undefined}
                            value={billing[field]}
                            onChange={(e) => updateBillingField(field, e.target.value)}
                            autoComplete={BILLING_AUTOCOMPLETE[field]}
                            required
                          />
                        )}
                        {field === 'billingEmail' && 'hint' in copy && (
                          <p id={`${inputId}-hint`} className="checkout__field-hint">
                            {copy.hint}
                          </p>
                        )}
                        {hasError && (
                          <p className="checkout__field-error" role="alert">
                            <AlertCircle size={13} strokeWidth={2} aria-hidden />
                            {copy.error}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>

                <div className="checkout__actions">
                  <button
                    type="button"
                    className="checkout__back"
                    onClick={() => setStep('plan')}
                  >
                    <ArrowLeft size={16} strokeWidth={2} aria-hidden />
                    <span>{content.billing.back}</span>
                  </button>
                  <Button variant="primary" size="large" type="submit">
                    {content.billing.continue}
                  </Button>
                </div>
              </form>
            </section>
          )}

          {step === 'payment' && (
            <section className="checkout__panel">
              <h2 className="checkout__panel-title">{content.payment.title}</h2>
              <p className="checkout__panel-sub">{content.payment.subtitle}</p>

              <dl className="checkout__summary">
                <div className="checkout__summary-row">
                  <dt>{content.payment.planLabel}</dt>
                  <dd>{selectedPlan.name}</dd>
                </div>
                <div className="checkout__summary-row">
                  <dt>{content.payment.usersLabel}</dt>
                  <dd>
                    {effectiveSeats > 0
                      ? fill(content.payment.usersValue, {
                          count: effectiveSeats + 1,
                          extra: effectiveSeats,
                        })
                      : content.payment.usersValueSingle}
                  </dd>
                </div>
                {effectiveSeats > 0 && (
                  <div className="checkout__summary-row">
                    <dt>
                      {fill(content.payment.seatsLine, {
                        count: effectiveSeats,
                        price: EXTRA_SEAT_PRICE_MONTH,
                      })}
                    </dt>
                    <dd>
                      {effectiveSeats * EXTRA_SEAT_PRICE_MONTH} {currencySymbol}
                      {content.payment.pricePeriodMonth}
                    </dd>
                  </div>
                )}
                <div className="checkout__summary-row checkout__summary-row--total">
                  <dt>{content.payment.totalLabel}</dt>
                  <dd>
                    {totalPrice} {currencySymbol}
                    {content.payment.pricePeriodMonth}
                  </dd>
                </div>
              </dl>

              {/* Snapshot de facturación introducida en el paso 2. */}
              <div className="checkout__billing-snapshot">
                <h3 className="checkout__snapshot-title">{content.payment.billingTitle}</h3>
                <p className="checkout__snapshot-line">
                  {billing.legalName} · {billing.taxId.toUpperCase()}
                </p>
                <p className="checkout__snapshot-line">
                  {billing.addressLine}, {billing.postalCode} {billing.city} ({billing.province},{' '}
                  {billing.country.toUpperCase()})
                </p>
                <p className="checkout__snapshot-line">{billing.billingEmail}</p>
              </div>

              {payError && (
                <p className="checkout__pay-error" role="alert">
                  <AlertCircle size={15} strokeWidth={2} aria-hidden />
                  {payError}
                  {subscriptionLimitHit && (
                    <>
                      {' '}
                      <a href={`${getLocaleUrl('/cuenta', locale)}#billing`} className="checkout__pay-error-link">
                        {content.payment.manageSubscriptionLink}
                      </a>
                    </>
                  )}
                </p>
              )}

              <div className="checkout__actions">
                <button
                  type="button"
                  className="checkout__back"
                  onClick={() => setStep('billing')}
                  disabled={submitting}
                >
                  <ArrowLeft size={16} strokeWidth={2} aria-hidden />
                  <span>{content.payment.back}</span>
                </button>
                <Button
                  variant="primary"
                  size="large"
                  onClick={handlePay}
                  disabled={submitting}
                >
                  {submitting ? content.payment.payLoading : content.payment.payIdle}
                </Button>
              </div>

              <p className="checkout__secure-note">
                <Lock size={13} strokeWidth={2} aria-hidden />
                {content.payment.secureNote}
              </p>
            </section>
          )}
        </>
      )}
    </main>
  )
}
