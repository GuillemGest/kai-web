import { useEffect, useState, type CSSProperties } from 'react'
import { ShieldCheck, CreditCard, Headset, Building2, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { billingUseCases } from '../../modules/billing/application/factory'
import { authUseCases } from '../../modules/auth/application/factory'
import { Plan } from '../../modules/billing/domain/Plan'
import { PlanCard, type BillingPeriod } from '../components/PlanCard/PlanCard'
import { PlanComparison, type PlanComparisonContent } from '../components/PlanComparison/PlanComparison'
import { startCheckout } from '../utils/startCheckout'
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

// Planes visibles en el grid: solo los tres cloud "del medio". El gratuito
// (free) sale como chip de prueba en el encabezado y el a medida (enterprise)
// como bloque de contacto discreto bajo el grid, así que se filtran aquí.
const GRID_PLAN_IDS: readonly PlanId[] = ['audioPro', 'fullPro', 'team']
// Plan destacado del grid ("Más popular"): la puerta de entrada completa.
const HIGHLIGHTED_PLAN_ID: PlanId = 'fullPro'

interface ShopPlansProps {
  content: ShopPageContent
  planTranslations: PlanTranslations
  loginHref: string
}

export function ShopPlans({ content, planTranslations, loginHref }: ShopPlansProps) {
  const { planCard, error, empty, reassurance, faq, comparison, yearlyDiscountPercent, enterpriseContact } =
    content
  const enterpriseMailto = `mailto:${enterpriseContact.email}?subject=${encodeURIComponent(
    enterpriseContact.emailSubject,
  )}`
  const [plans, setPlans] = useState<Plan[]>([])
  const [state, setState] = useState<LoadState>('loading')
  // El toggle mensual/anual esta desactivado temporalmente (ver comentario en el JSX
  // original de ShopPage.tsx): el pricing v1 solo define precios mensuales.
  const [billingPeriod] = useState<BillingPeriod>('monthly')

  // Solo los tres planes del medio, en orden, con el destacado forzado en
  // presentación (el dominio los marca todos highlighted=false). El free y el
  // enterprise no entran al grid: viven en el chip de prueba y en el bloque
  // de contacto respectivamente.
  const gridPlans = GRID_PLAN_IDS.map((id) => plans.find((p) => p.id === id)).filter(
    (p): p is Plan => Boolean(p),
  )
  const localizedPlans = gridPlans.map((p) => {
    const localized = localizePlan(p, planTranslations)
    if (p.id !== HIGHLIGHTED_PLAN_ID) return localized
    return Plan.fromPrimitive({ ...localized.toPrimitive(), highlighted: true })
  })

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

  async function handleSelect(plan: Plan) {
    // Los planes a medida (KAI Enterprise) no tienen checkout: derivan a contacto
    // para solicitar presupuesto por produccion.
    if (plan.custom) {
      window.location.href = empty.linkHref
      return
    }

    // Si ya hay sesion, vamos directos al checkout de Stripe. Si no, llevamos al
    // login arrastrando el plan (?plan=<id>) para retomar la compra tras entrar.
    const user = authUseCases.getCurrentUserSync.execute()
    if (!user) {
      window.location.href = `${loginHref}?plan=${plan.id}`
      return
    }

    try {
      await startCheckout({
        planId: plan.id,
        period: billingPeriod,
        userId: user.id,
        customerEmail: user.email,
      })
    } catch {
      // El checkout no arranco (endpoint caido, plan sin precio...): reutilizamos
      // el mismo aviso de error que la carga de planes.
      setState('error')
    }
  }

  return (
    <>
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
        <aside className="shop__enterprise" data-reveal>
          <span className="shop__enterprise-icon" aria-hidden>
            <Building2 size={18} strokeWidth={2} />
          </span>
          <div className="shop__enterprise-body">
            <p className="shop__enterprise-label">{enterpriseContact.label}</p>
            <p className="shop__enterprise-text">{enterpriseContact.text}</p>
          </div>
          <a className="shop__enterprise-cta" href={enterpriseMailto}>
            {enterpriseContact.ctaLabel}
            <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
          </a>
        </aside>
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
