import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'
import type { Subscription } from '../domain/Subscription'

export class GetCurrentSubscription {
  constructor(private readonly repository: ISubscriptionRepository) {}

  execute(userId: string): Promise<Subscription | null> {
    return this.repository.getCurrent(userId)
  }
}
