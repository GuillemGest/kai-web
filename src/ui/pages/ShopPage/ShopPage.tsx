import { useEffect, useState } from 'react'
import { billingUseCases } from '../../../modules/billing/application/factory'
import type { Plan } from '../../../modules/billing/domain/Plan'
import { PlanCard } from '../../components/PlanCard/PlanCard'
import './ShopPage.css'

export function ShopPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    billingUseCases.getPlans.execute().then((result) => {
      setPlans(result)
      setLoading(false)
    })
  }, [])

  return (
    <div className="page">
      <h1 className="page__title">Planes</h1>
      <p className="page__lead">
        Suscripción mensual, cancela cuando quieras. Todos los planes incluyen el plugin KAI y sus
        actualizaciones.
      </p>

      {loading ? (
        <p className="page__lead">Cargando planes…</p>
      ) : (
        <div className="plans-grid page__section">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  )
}
