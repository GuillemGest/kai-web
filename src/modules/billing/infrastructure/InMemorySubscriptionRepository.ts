import type { ISubscriptionRepository } from '../domain/ISubscriptionRepository'
import { Subscription, type SubscriptionPrimitive } from '../domain/Subscription'

const SUBSCRIPTION: SubscriptionPrimitive = {
  id: 'sub-1',
  userId: 'user-1',
  planId: 'fullPro',
  status: 'active',
  currentPeriodEnd: '2026-07-15T10:00:00.000Z',
  stripeSubscriptionId: null,
}

export class InMemorySubscriptionRepository implements ISubscriptionRepository {
  async getCurrent(userId: string): Promise<Subscription | null> {
    return userId === SUBSCRIPTION.userId ? Subscription.fromPrimitive(SUBSCRIPTION) : null
  }
}
