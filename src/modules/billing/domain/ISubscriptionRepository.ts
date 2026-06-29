import type { Subscription } from './Subscription'

export interface ISubscriptionRepository {
  getCurrent(userId: string): Promise<Subscription | null>
}
