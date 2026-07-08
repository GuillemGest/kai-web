import { useEffect, useState, type CSSProperties } from 'react'
import { ShieldCheck, CreditCard, Headset, type LucideIcon } from 'lucide-react'
import { billingUseCases } from '../../modules/billing/application/factory'
import { Plan } from '../../modules/billing/domain/Plan'
import { PlanCard, type BillingPeriod } from '../components/PlanCard/PlanCard'
import { PlanComparison, type PlanComparisonContent } from '../components/PlanComparison/PlanComparison'
import type { ShopPageContent, PlanTranslations, PlanId } from '../../modules/content/domain/types'

type LoadState = 'loading' | 'ready' | 'error'
type ShopReassuranceIcon = ShopPageContent['reassurance'][number]['iconName']

function localizePlan(
  plan: Plan,
  translations: Record<PlanId, { name: string; capacity: string; features: readonly string[] }>,
): Plan {
  const t = translations[plan.id as PlanId]
  if (!t) return plan
  return Plan.fromPrimitive({
    ...plan.toPrimitive(),
    name: t.name,
    capacity: t.capacity,
    features: [...t.features],
  })
}

const REASSURANCE_ICONS: Record<ShopReassuranceIcon, LucideIcon> = {
  ShieldCheck,
  CreditCard,
  Headset,
}

interface ShopPlansProps {
  content: ShopPageContent
  planTranslations: PlanTranslations
  loginHref: string
}

export function ShopPlans({ content, planTranslations, loginHref }: ShopPlansProps) {
  const { planCard, error, empty, reassurance, faq, comparison, yearlyDiscountPercent } = content
  const [plans, setPlans] = useState<Plan[]>([])
  const [state, setState] = useState<LoadState>('loading')
  // El toggle mensual/anual esta desactivado temporalmente (ver comentario en el JSX
  // original de ShopPage.tsx): el pricing v1 solo define precios mensuales.
  const [billingPeriod] = useState<BillingPeriod>('monthly')

  const localizedPlans = plans.map((p) => localizePlan(p, planTranslations))

  function loadPlans() {
    setState('loading')
    billingUseCases.getPlans
      .execute()
      .then((result) => {
        setPlans(result)
        setState('ready')
      })
      .catch(() => setState('error'))
  }

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

  function handleSelect(plan: Plan) {
    // Los planes a medida (KAI Enterprise) no tienen checkout: derivan a contacto
    // para solicitar presupuesto por produccion.
    if (plan.custom) {
      window.location.href = empty.linkHref
      return
    }
    window.location.href = `${loginHref}?plan=${plan.id}`
  }

  return (
    <>
      {state === 'loading' && (
        <div className="plans-grid" aria-hidden>
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="plan-skeleton" />
          ))}
        </div>
      )}

      {state === 'error' && (
        <div className="shop__error" role="alert">
          <p>{error.message}</p>
          <button type="button" className="shop__retry" onClick={loadPlans}>
            {error.retry}
          </button>
        </div>
      )}

      {state === 'ready' && localizedPlans.length > 0 && (
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
      )}

      {state === 'ready' && localizedPlans.length === 0 && (
        <div className="shop__empty">
          <p>{empty.message}</p>
          <p className="shop__empty-hint">{empty.hint}</p>
          <a href={empty.linkHref} className="shop__empty-link">
            {empty.linkLabel}
          </a>
        </div>
      )}

      {state === 'ready' && localizedPlans.length > 0 && (
        <div data-reveal>
          <PlanComparison content={comparison as PlanComparisonContent} />
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
    </>
  )
}
