export interface PlanPrimitive {
  id: string
  name: string
  priceMonth: number
  currency: string
  features: string[]
  stripePriceId: string | null
  highlighted: boolean
}

export class Plan {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly priceMonth: number,
    readonly currency: string,
    readonly features: string[],
    readonly stripePriceId: string | null,
    readonly highlighted: boolean,
  ) {}

  static fromPrimitive(data: PlanPrimitive): Plan {
    return new Plan(
      data.id,
      data.name,
      data.priceMonth,
      data.currency,
      data.features,
      data.stripePriceId,
      data.highlighted,
    )
  }

  toPrimitive(): PlanPrimitive {
    return {
      id: this.id,
      name: this.name,
      priceMonth: this.priceMonth,
      currency: this.currency,
      features: this.features,
      stripePriceId: this.stripePriceId,
      highlighted: this.highlighted,
    }
  }
}
