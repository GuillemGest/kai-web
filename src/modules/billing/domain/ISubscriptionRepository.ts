import type { Subscription } from './Subscription'

export interface ISubscriptionRepository {
  /**
   * TODAS las suscripciones del email indicado (un usuario puede tener varios
   * planes a la vez). Ordenadas por relevancia: activas primero, luego con
   * impago, luego canceladas; a igualdad de estado, la más reciente primero.
   * El email es la identidad de facturación: es la clave del Customer en
   * Stripe (el checkout crea/reutiliza el Customer por email).
   */
  listByEmail(email: string): Promise<Subscription[]>
}
