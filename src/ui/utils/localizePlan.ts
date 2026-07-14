import { Plan } from '../../modules/billing/domain/Plan'
import type { PlanId } from '../../modules/content/domain/types'

/**
 * Sustituye los textos estructurales del plan (definidos en el dominio en
 * castellano) por sus traducciones de `plans.content.*`. Compartido por
 * ShopPlans y CheckoutWizard para no duplicar el mapeo.
 */
export function localizePlan(
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
