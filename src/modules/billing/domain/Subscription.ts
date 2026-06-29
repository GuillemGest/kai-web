export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'none'

export interface SubscriptionPrimitive {
  id: string
  userId: string
  planId: string
  status: SubscriptionStatus
  currentPeriodEnd: string
  stripeSubscriptionId: string | null
}

export class Subscription {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly planId: string,
    readonly status: SubscriptionStatus,
    readonly currentPeriodEnd: string,
    readonly stripeSubscriptionId: string | null,
  ) {}

  get isActive(): boolean {
    return this.status === 'active'
  }

  static fromPrimitive(data: SubscriptionPrimitive): Subscription {
    return new Subscription(
      data.id,
      data.userId,
      data.planId,
      data.status,
      data.currentPeriodEnd,
      data.stripeSubscriptionId,
    )
  }

  toPrimitive(): SubscriptionPrimitive {
    return {
      id: this.id,
      userId: this.userId,
      planId: this.planId,
      status: this.status,
      currentPeriodEnd: this.currentPeriodEnd,
      stripeSubscriptionId: this.stripeSubscriptionId,
    }
  }
}
