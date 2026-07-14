import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'
import type { Subscription } from '../domain/Subscription'

export class GetSubscriptions {
  constructor(private readonly repository: ISubscriptionRepository) {}

  execute(email: string): Promise<Subscription[]> {
    return this.repository.listByEmail(email)
  }
}
