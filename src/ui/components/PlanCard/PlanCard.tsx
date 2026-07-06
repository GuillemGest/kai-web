import { Check } from 'lucide-react'
import type { Plan } from '../../../modules/billing/domain/Plan'
import { Button } from '../Button/Button'
import './PlanCard.css'

export type BillingPeriod = 'monthly' | 'yearly'

export interface PlanCardCopy {
  popularBadge: string
  pricePeriodMonth: string
  pricePeriodYear: string
  priceFromPrefix: string
  customPriceLabel: string
  customCtaLabel: string
  referencesLabel: string
  selectCtaTemplate: string
  discountBadgeTemplate: string
}

interface PlanCardProps {
  plan: Plan
  copy: PlanCardCopy
  billingPeriod: BillingPeriod
  yearlyDiscountPercent: number
  /** Referencias comerciales orientativas (solo planes a medida, p. ej. KAI 24/7). */
  references?: readonly string[]
  onSelect?: (plan: Plan) => void
}

export function PlanCard({
  plan,
  copy,
  billingPeriod,
  yearlyDiscountPercent,
  references,
  onSelect,
}: PlanCardProps) {
  const currencySymbol = plan.currency === 'EUR' ? '€' : plan.currency
  const isYearly = billingPeriod === 'yearly'
  const discountLabel = copy.discountBadgeTemplate.replace('{percent}', String(yearlyDiscountPercent))

  // Plan de cotización a medida (sin precio fijo): p. ej. KAI 24/7.
  const isCustom = plan.custom || plan.priceMonth === null
  const yearlyFull = (plan.priceMonth ?? 0) * 12
  const yearlyDiscounted = Math.round(yearlyFull * (1 - yearlyDiscountPercent / 100))

  return (
    <article className={`plan-card ${plan.highlighted ? 'plan-card--highlighted' : ''}`}>
      {plan.highlighted && <span className="plan-card__badge">{copy.popularBadge}</span>}

      <h3 className="plan-card__name">{plan.name}</h3>

      {!isCustom && <p className="plan-card__from">{copy.priceFromPrefix}</p>}

      {isCustom ? (
        <p className="plan-card__price">
          <span className="plan-card__amount plan-card__amount--custom">{copy.customPriceLabel}</span>
        </p>
      ) : (
        <p className="plan-card__price">
          {isYearly ? (
            <>
              <span className="plan-card__amount-original">
                {yearlyFull} {currencySymbol}
              </span>
              <span className="plan-card__amount">
                {yearlyDiscounted} {currencySymbol}
                <span className="plan-card__period">{copy.pricePeriodYear}</span>
              </span>
              <span className="plan-card__discount">{discountLabel}</span>
            </>
          ) : (
            <span className="plan-card__amount">
              {plan.priceMonth} {currencySymbol}
              <span className="plan-card__period">{copy.pricePeriodMonth}</span>
            </span>
          )}
        </p>
      )}

      <ul className="plan-card__features">
        {plan.features.map((feature) => (
          <li key={feature} className="plan-card__feature">
            <Check size={16} strokeWidth={2} className="plan-card__check" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

      {isCustom && references && references.length > 0 && (
        <div className="plan-card__references">
          <p className="plan-card__references-label">{copy.referencesLabel}</p>
          <ul className="plan-card__references-list">
            {references.map((ref) => (
              <li key={ref} className="plan-card__references-item">
                {ref}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button
        variant={plan.highlighted ? 'primary' : 'secondary'}
        size="large"
        className="plan-card__cta"
        onClick={() => onSelect?.(plan)}
      >
        {isCustom ? copy.customCtaLabel : copy.selectCtaTemplate.replace('{name}', plan.name)}
      </Button>
    </article>
  )
}
