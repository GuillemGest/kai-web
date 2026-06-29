import { Check } from 'lucide-react'
import type { Plan } from '../../../modules/billing/domain/Plan'
import { Button } from '../Button/Button'
import './PlanCard.css'

interface PlanCardProps {
  plan: Plan
  onSelect?: (plan: Plan) => void
}

export function PlanCard({ plan, onSelect }: PlanCardProps) {
  return (
    <article className={`plan-card ${plan.highlighted ? 'plan-card--highlighted' : ''}`}>
      {plan.highlighted && <span className="plan-card__badge">Más popular</span>}

      <h3 className="plan-card__name">{plan.name}</h3>

      <p className="plan-card__price">
        <span className="plan-card__amount">
          {plan.priceMonth} {plan.currency === 'EUR' ? '€' : plan.currency}
        </span>
        <span className="plan-card__period">/mes</span>
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
        Elegir {plan.name}
      </Button>
    </article>
  )
}
