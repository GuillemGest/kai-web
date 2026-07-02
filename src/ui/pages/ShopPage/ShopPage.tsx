import { useEffect, useState, type CSSProperties } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, CreditCard, Headset, type LucideIcon } from 'lucide-react'
import { billingUseCases } from '../../../modules/billing/application/factory'
import { Plan } from '../../../modules/billing/domain/Plan'
import { PlanCard, type BillingPeriod } from '../../components/PlanCard/PlanCard'
import { PlanComparison } from '../../components/PlanComparison/PlanComparison'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useLocale } from '../../../i18n/LocaleContext'
import { SHOP_PAGE_CONTENT, PLAN_TRANSLATIONS, type PlanId, type ShopReassuranceIcon } from './content'
import './ShopPage.css'

type LoadState = 'loading' | 'ready' | 'error'

function localizePlan(plan: Plan, translations: Record<PlanId, { name: string; features: readonly string[] }>): Plan {
  const t = translations[plan.id as PlanId]
  if (!t) return plan
  return Plan.fromPrimitive({ ...plan.toPrimitive(), name: t.name, features: [...t.features] })
}

const REASSURANCE_ICONS: Record<ShopReassuranceIcon, LucideIcon> = {
  ShieldCheck,
  CreditCard,
  Headset,
}

export function ShopPage() {
  const { locale } = useLocale()
  const {
    planCard,
    head,
    error,
    empty,
    reassurance,
    faq,
    comparison,
    billingToggle,
    yearlyDiscountPercent,
  } = SHOP_PAGE_CONTENT[locale]
  const planTranslations = PLAN_TRANSLATIONS[locale]
  const navigate = useNavigate()
  const [plans, setPlans] = useState<Plan[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  const localizedPlans = plans.map((p) => localizePlan(p, planTranslations))

  useEffect(() => {
    let active = true
    billingUseCases.getPlans
      .execute()
      .then((result) => {
        if (!active) return
        setPlans(result)
        setState('ready')
      })
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [])

  const handleSelect = (plan: Plan) => {
    navigate(`/login?plan=${plan.id}`)
  }

  // Re-observa al pasar a 'ready' (la zona inferior es estable, pero el reveal
  // se inicializa una vez montado el contenido principal).
  useScrollReveal([state])

  return (
    <div className="shop">
      <header className="shop__head">
        <h1 className="shop__title">{head.title}</h1>
        <p className="shop__lead">{head.lead}</p>
      </header>

      {state === 'loading' && (
        <div className="plans-grid" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="plan-skeleton" />
          ))}
        </div>
      )}

      {state === 'error' && (
        <div className="shop__error" role="alert">
          <p>{error.message}</p>
          <button
            type="button"
            className="shop__retry"
            onClick={() => {
              setState('loading')
              billingUseCases.getPlans
                .execute()
                .then((result) => {
                  setPlans(result)
                  setState('ready')
                })
                .catch(() => setState('error'))
            }}
          >
            {error.retry}
          </button>
        </div>
      )}

      {state === 'ready' && localizedPlans.length > 0 && (
        <>
          <div
            className="billing-toggle"
            role="radiogroup"
            aria-label={billingToggle.label}
          >
            <button
              type="button"
              role="radio"
              aria-checked={billingPeriod === 'monthly'}
              className={`billing-toggle__option ${billingPeriod === 'monthly' ? 'billing-toggle__option--active' : ''}`}
              onClick={() => setBillingPeriod('monthly')}
            >
              {billingToggle.monthly}
            </button>
            <div className="billing-toggle__yearly-wrap">
              <button
                type="button"
                role="radio"
                aria-checked={billingPeriod === 'yearly'}
                className={`billing-toggle__option ${billingPeriod === 'yearly' ? 'billing-toggle__option--active' : ''}`}
                onClick={() => setBillingPeriod('yearly')}
              >
                {billingToggle.yearly}
              </button>
              <span className="billing-toggle__savings" aria-hidden>
                {billingToggle.savingsHint.replace('{percent}', String(yearlyDiscountPercent))}
              </span>
            </div>
          </div>

          <ul className="plans-grid">
            {localizedPlans.map((plan, i) => (
              <li key={plan.id} className="plans-grid__item" style={{ '--i': i } as CSSProperties}>
                <PlanCard
                  plan={plan}
                  copy={planCard}
                  billingPeriod={billingPeriod}
                  yearlyDiscountPercent={yearlyDiscountPercent}
                  onSelect={handleSelect}
                />
              </li>
            ))}
          </ul>
        </>
      )}

      {state === 'ready' && localizedPlans.length === 0 && (
        <div className="shop__empty">
          <p>{empty.message}</p>
          <p className="shop__empty-hint">{empty.hint}</p>
          <Link to={empty.linkHref} className="shop__empty-link">
            {empty.linkLabel}
          </Link>
        </div>
      )}

      {state === 'ready' && localizedPlans.length > 0 && (
        <div data-reveal>
          <PlanComparison content={comparison} />
        </div>
      )}

      <ul className="shop__reassurance" data-reveal>
        {reassurance.map(({ iconName, text }) => {
          const Icon = REASSURANCE_ICONS[iconName]
          return (
            <li key={text} className="shop__reassurance-item">
              <Icon size={18} strokeWidth={2} aria-hidden />
              {text}
            </li>
          )
        })}
      </ul>

      <section className="shop__faq">
        <h2 className="shop__faq-title" data-reveal>
          {faq.title}
        </h2>
        <div className="shop__faq-list" data-reveal>
          {faq.items.map(({ q, a }) => (
            <details key={q} name="shop-faq" className="faq">
              <summary className="faq__q">{q}</summary>
              <p className="faq__a">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
