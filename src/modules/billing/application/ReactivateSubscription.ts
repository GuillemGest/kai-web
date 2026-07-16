import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'

/**
 * Revierte una baja programada (cancel at period end) que aún no se ha hecho
 * efectiva: la suscripción vuelve a renovarse con normalidad.
 */
export class ReactivateSubscription {
  constructor(private readonly repository: ISubscriptionRepository) {}

  execute(email: string, subscriptionId: string): Promise<void> {
    return this.repository.reactivate(email, subscriptionId)
  }
}
