import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'
import type { Subscription } from '../domain/Subscription'

export class GetSubscriptions {
  constructor(private readonly repository: ISubscriptionRepository) {}

  execute(organizationId: string): Promise<Subscription[]> {
    return this.repository.listByOrganization(organizationId)
  }
}
