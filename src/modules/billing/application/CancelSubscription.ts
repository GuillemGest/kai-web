import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'

/**
 * Programa la baja de una suscripción al final del periodo ya pagado (nunca
 * corta el acceso en caliente: el usuario disfruta lo que pagó y no se renueva).
 * La titularidad (organización ↔ suscripción) la verifica el repositorio, que
 * lanza SubscriptionNotFoundError si no corresponde.
 */
export class CancelSubscription {
  constructor(private readonly repository: ISubscriptionRepository) {}

  execute(organizationId: string, subscriptionId: string): Promise<void> {
    return this.repository.cancelAtPeriodEnd(organizationId, subscriptionId)
  }
}
