import type { Subscription } from './Subscription'
import type { BillingPeriod, Plan, PlanChangeTiming } from './Plan'

export interface ISubscriptionRepository {
  /**
   * TODAS las suscripciones de la organización indicada (puede tener varios
   * planes a la vez). Ordenadas por relevancia: activas primero, luego con
   * impago, luego canceladas; a igualdad de estado, la más reciente primero.
   * La organización es la identidad de facturación: tiene un único Customer
   * en Stripe (`stripeCustomerId`, resuelto vía `resolveCustomerId`).
   */
  listByOrganization(organizationId: string): Promise<Subscription[]>

  /**
   * Programa la baja de la suscripción al final del periodo ya pagado (no se
   * corta el acceso ni se reembolsa nada). La organización verifica la
   * titularidad: si la suscripción no le pertenece, la operación falla.
   */
  cancelAtPeriodEnd(organizationId: string, subscriptionId: string): Promise<void>

  /** Revierte una baja programada que aún no se ha hecho efectiva. */
  reactivate(organizationId: string, subscriptionId: string): Promise<void>

  /**
   * Cambia el plan de la suscripción según `timing` (regla en `planChangeTiming`):
   * `now_prorated` deja pendiente de pago SOLO la diferencia prorrateada del
   * periodo en curso (el precio del item ya queda actualizado, pero el cargo
   * no se factura en caliente); `at_period_end` lo programa para la siguiente
   * renovación manteniendo el plan actual, sin cobro ahora.
   *
   * Devuelve `paymentUrl`: la página de factura alojada de Stripe donde el
   * usuario confirma el cargo (y puede cambiar de tarjeta) para un upgrade con
   * importe pendiente. `null` cuando no hace falta pago (downgrade, o upgrade
   * sin diferencia que cobrar). El plan NO se da por confirmado hasta que esa
   * factura se paga — mientras tanto la suscripción puede quedar `past_due`.
   */
  changePlan(
    organizationId: string,
    subscriptionId: string,
    target: Plan,
    period: BillingPeriod,
    timing: PlanChangeTiming,
  ): Promise<{ paymentUrl: string | null }>
}
