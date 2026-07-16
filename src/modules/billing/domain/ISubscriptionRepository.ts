import type { Subscription } from './Subscription'
import type { BillingPeriod, Plan, PlanChangeTiming } from './Plan'

export interface ISubscriptionRepository {
  /**
   * TODAS las suscripciones del email indicado (un usuario puede tener varios
   * planes a la vez). Ordenadas por relevancia: activas primero, luego con
   * impago, luego canceladas; a igualdad de estado, la más reciente primero.
   * El email es la identidad de facturación: es la clave del Customer en
   * Stripe (el checkout crea/reutiliza el Customer por email).
   */
  listByEmail(email: string): Promise<Subscription[]>

  /**
   * Programa la baja de la suscripción al final del periodo ya pagado (no se
   * corta el acceso ni se reembolsa nada). El email verifica la titularidad:
   * si la suscripción no pertenece a ese email, la operación falla.
   */
  cancelAtPeriodEnd(email: string, subscriptionId: string): Promise<void>

  /** Revierte una baja programada que aún no se ha hecho efectiva. */
  reactivate(email: string, subscriptionId: string): Promise<void>

  /**
   * Cambia el plan de la suscripción según `timing` (regla en `planChangeTiming`):
   * `now_prorated` aplica ya cobrando la diferencia prorrateada; `at_period_end`
   * lo programa para la siguiente renovación manteniendo el plan actual.
   */
  changePlan(
    email: string,
    subscriptionId: string,
    target: Plan,
    period: BillingPeriod,
    timing: PlanChangeTiming,
  ): Promise<void>
}
