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
  stripePriceId: string | null
  highlighted: boolean
}

export class Plan {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly priceMonth: number | null,
    readonly currency: string,
    readonly capacity: string | null,
    readonly custom: boolean,
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
      data.capacity,
      data.custom,
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
      capacity: this.capacity,
      custom: this.custom,
      features: this.features,
      stripePriceId: this.stripePriceId,
      highlighted: this.highlighted,
    }
  }
}
