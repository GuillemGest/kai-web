import { Check } from 'lucide-react'
import type { Plan } from '../../../modules/billing/domain/Plan'
import { Button } from '../Button/Button'
import './PlanCard.css'

export type BillingPeriod = 'monthly' | 'yearly'

export interface PlanCardCopy {
  popularBadge: string
  pricePeriodMonth: string
  pricePeriodYear: string
  selectCtaTemplate: string
  discountBadgeTemplate: string
}

interface PlanCardProps {
  plan: Plan
  copy: PlanCardCopy
  billingPeriod: BillingPeriod
  yearlyDiscountPercent: number
  onSelect?: (plan: Plan) => void
}

export function PlanCard({ plan, copy, billingPeriod, yearlyDiscountPercent, onSelect }: PlanCardProps) {
  const currencySymbol = plan.currency === 'EUR' ? '€' : plan.currency
  const yearlyFull = plan.priceMonth * 12
  const yearlyDiscounted = Math.round(yearlyFull * (1 - yearlyDiscountPercent / 100))
  const isYearly = billingPeriod === 'yearly'
  const discountLabel = copy.discountBadgeTemplate.replace('{percent}', String(yearlyDiscountPercent))

  return (
    <article className={`plan-card ${plan.highlighted ? 'plan-card--highlighted' : ''}`}>
      {plan.highlighted && <span className="plan-card__badge">{copy.popularBadge}</span>}

      <h3 className="plan-card__name">{plan.name}</h3>

      <p className="plan-card__price">
        {isYearly ? (
          <>
            <span className="plan-card__amount-original">
              {yearlyFull} {currencySymbol}
            </span>
            <span className="plan-card__amount">
              {yearlyDiscounted} {currencySymbol}
            </span>
            <span className="plan-card__period">{copy.pricePeriodYear}</span>
            <span className="plan-card__discount">{discountLabel}</span>
          </>
        ) : (
          <>
            <span className="plan-card__amount">
              {plan.priceMonth} {currencySymbol}
            </span>
            <span className="plan-card__period">{copy.pricePeriodMonth}</span>
          </>
        )}
      </p>

      <ul className="plan-card__features">
        {plan.features.map((feature) => (
          <li key={feature} className="plan-card__feature">
            <Check size={16} strokeWidth={2} className="plan-card__check" aria-hidden />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        variant={plan.highlighted ? 'primary' : 'secondary'}
        size="large"
        className="plan-card__cta"
        onClick={() => onSelect?.(plan)}
      >
        {copy.selectCtaTemplate.replace('{name}', plan.name)}
      </Button>
    </article>
  )
}
