import { useEffect, useState, type CSSProperties } from 'react'
import { ShieldCheck, CreditCard, Headset, Building2, ArrowUpRight, type LucideIcon } from 'lucide-react'
import type { Locale } from '../../i18n/locales'
import { ContactEmail } from '../components/ContactEmail/ContactEmail'
import { CONTACT_EMAIL_LABELS } from '../components/ContactEmail/ContactEmail.labels'
import { CONTACT_EMAILS, kaiPanelUrl } from '../../config/appUrls'
import { billingUseCases } from '../../modules/billing/application/factory'
import { authUseCases } from '../../modules/auth/application/factory'
import { Plan } from '../../modules/billing/domain/Plan'
import { PlanCard, type BillingPeriod } from '../components/PlanCard/PlanCard'
import { PlanComparison, type PlanComparisonContent } from '../components/PlanComparison/PlanComparison'
import { localizePlan } from '../utils/localizePlan'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { ShopPageContent, PlanTranslations, PlanId } from '../../modules/content/domain/types'

type LoadState = 'loading' | 'ready' | 'error'
type ShopReassuranceIcon = ShopPageContent['reassurance'][number]['iconName']

const REASSURANCE_ICONS: Record<ShopReassuranceIcon, LucideIcon> = {
  ShieldCheck,
  CreditCard,
  Headset,
}

// Planes visibles en el grid: el gratuito (free) y los tres cloud. El plan a
// medida (enterprise) NO entra al grid: vive en el bloque de contacto discreto
// bajo el grid, así que se filtra aquí.
const GRID_PLAN_IDS: readonly PlanId[] = ['free', 'audioPro', 'fullPro', 'team']
// Plan destacado del grid ("Más popular"): la puerta de entrada completa.
const HIGHLIGHTED_PLAN_ID: PlanId = 'fullPro'

interface ShopPlansProps {
  content: ShopPageContent
  planTranslations: PlanTranslations
  loginHref: string
  locale: Locale
}

export function ShopPlans({ content, planTranslations, loginHref, locale }: ShopPlansProps) {
  const { planCard, error, empty, reassurance, faq, comparison, yearlyDiscountPercent, enterpriseContact } =
    content
  const [plans, setPlans] = useState<Plan[]>([])
  const [state, setState] = useState<LoadState>('loading')
  // El toggle mensual/anual esta desactivado temporalmente (ver comentario en el JSX
  // original de ShopPage.tsx): el pricing v1 solo define precios mensuales.
  const [billingPeriod] = useState<BillingPeriod>('monthly')

  // Free + los tres planes cloud, en orden, con el destacado forzado en
  // presentación (el dominio los marca todos highlighted=false). El enterprise
  // no entra al grid: vive en el bloque de contacto bajo el grid.
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

    // El plan gratuito NO es una compra: no pasa por /checkout. Se comporta como
    // el FreeTrialButton: con sesion, handoff SSO al panel de KAI; sin sesion, al
    // login arrastrando el plan free para activar la prueba tras entrar.
    if (plan.id === 'free') {
      const freeLoginHref = `${loginHref}?plan=free`
      try {
        const hadSession = await authUseCases.preparePanelHandoff.execute()
        window.location.href = hadSession ? kaiPanelUrl(locale) : freeLoginHref
      } catch {
        // Si el handoff falla (red, backend caido…), caemos al login, que
        // reconstruye la sesion y continua el flujo.
        window.location.href = freeLoginHref
      }
      return
    }

    // Planes de pago. Si ya hay sesion, al wizard de compra (/checkout) donde se
    // ajustan plan, usuarios y datos de facturacion antes de Stripe. Si no, al
    // login arrastrando el plan (?plan=<id>) para retomar la compra tras entrar.
    const user = authUseCases.getCurrentUserSync.execute()
    if (!user) {
      window.location.href = `${loginHref}?plan=${plan.id}`
      return
    }

    window.location.href = `${getLocaleUrl('/checkout', locale)}?plan=${plan.id}`
  }

  return (
    <>
      {state === 'loading' && (
        <div className="plans-grid" aria-hidden>
          {[0, 1, 2, 3].map((i) => (
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
          <ContactEmail
            email={CONTACT_EMAILS.sales}
            subject={enterpriseContact.emailSubject}
            triggerClassName="shop__enterprise-cta"
            labels={CONTACT_EMAIL_LABELS[locale]}
          >
            {enterpriseContact.ctaLabel}
            <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
          </ContactEmail>
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
