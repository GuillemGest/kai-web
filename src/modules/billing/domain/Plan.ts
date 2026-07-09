export interface PlanPrimitive {
  id: string
  name: string
  /**
   * Precio mensual de referencia en la moneda indicada.
   * `null` cuando el plan es de cotización a medida (p. ej. KAI Enterprise),
   * donde no hay tarifa fija cerrada sino presupuesto por producción.
   */
  priceMonth: number | null
  currency: string
  /**
   * Subtítulo de capacidad orientativo (p. ej. "250 GB o 100 h").
   * `null` cuando no aplica (plan a medida).
   */
  capacity: string | null
  /**
   * Marca el plan como cotización a medida (sin precio fijo).
   * Cuando es `true`, la UI muestra "A medida" en lugar de un importe.
   */
  custom: boolean
  features: string[]
  /**
   * IDs de precio recurrente en Stripe (`price_...`), uno por periodo de
   * facturación. `null` cuando el plan no se cobra vía Stripe (p. ej. KAI Free
   * o KAI Enterprise a medida). Ambos deben referirse al MISMO producto.
   */
  stripePriceIdMonthly: string | null
  stripePriceIdYearly: string | null
  highlighted: boolean
}

export type BillingPeriod = 'monthly' | 'yearly'

export class Plan {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly priceMonth: number | null,
    readonly currency: string,
    readonly capacity: string | null,
    readonly custom: boolean,
    readonly features: string[],
    readonly stripePriceIdMonthly: string | null,
    readonly stripePriceIdYearly: string | null,
    readonly highlighted: boolean,
  ) {}

  /**
   * Indica si el plan es comprable vía Stripe Checkout: no es a medida y tiene
   * al menos el precio mensual configurado. KAI Free/Enterprise devuelven false.
   */
  get isPurchasable(): boolean {
    return !this.custom && this.stripePriceIdMonthly !== null
  }

  /**
   * Devuelve el `price_...` de Stripe correspondiente al periodo indicado,
   * o `null` si ese periodo no está configurado para el plan.
   */
  stripePriceIdFor(period: BillingPeriod): string | null {
    return period === 'yearly' ? this.stripePriceIdYearly : this.stripePriceIdMonthly
  }

  static fromPrimitive(data: PlanPrimitive): Plan {
    return new Plan(
      data.id,
      data.name,
      data.priceMonth,
      data.currency,
      data.capacity,
      data.custom,
      data.features,
      data.stripePriceIdMonthly,
      data.stripePriceIdYearly,
      data.highlighted,
    )
  }

  toPrimitive(): PlanPrimitive {
    return {
      id: this.id,
      name: this.name,
      priceMonth: this.priceMonth,
      currency: this.currency,
      capacity: this.capacity,
      custom: this.custom,
      features: this.features,
      stripePriceIdMonthly: this.stripePriceIdMonthly,
      stripePriceIdYearly: this.stripePriceIdYearly,
      highlighted: this.highlighted,
    }
  }
}
