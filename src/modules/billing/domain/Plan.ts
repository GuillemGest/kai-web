/**
 * Precio mensual (EUR) de cada usuario adicional al incluido en el plan.
 * Vive en dominio porque es una regla de pricing, pero la verdad de cobro
 * sigue siendo el `price_...` de Stripe: este valor es solo para mostrar
 * totales en la UI y para validar límites, nunca para cobrar.
 */
export const EXTRA_SEAT_PRICE_MONTH = 10

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
   * Número máximo TOTAL de usuarios del plan (incluido el titular).
   * `null` cuando no aplica límite cerrado (planes a medida).
   */
  maxUsers: number | null
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

/**
 * Cuándo se aplica un cambio de plan sobre una suscripción activa:
 *  - `now_prorated`: al momento, cobrando ya SOLO la diferencia prorrateada
 *    del periodo en curso (upgrades: el usuario recibe más valor hoy).
 *  - `at_period_end`: en la siguiente renovación; hasta entonces se mantiene
 *    el plan actual ya pagado (downgrades: no se regala ni se reembolsa nada).
 */
export type PlanChangeTiming = 'now_prorated' | 'at_period_end'

/**
 * Regla de negocio del cambio de plan. Subir de precio → cobro inmediato de la
 * diferencia prorrateada; bajar (o mismo precio / sin precio fijo) → el cambio
 * espera al fin del periodo ya pagado.
 */
export function planChangeTiming(current: Plan, target: Plan): PlanChangeTiming {
  if (current.priceMonth === null || target.priceMonth === null) return 'at_period_end'
  return target.priceMonth > current.priceMonth ? 'now_prorated' : 'at_period_end'
}

export class Plan {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly priceMonth: number | null,
    readonly currency: string,
    readonly maxUsers: number | null,
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

  /**
   * Usuarios adicionales que admite el plan por encima del incluido.
   * Los planes sin límite cerrado (a medida) no venden asientos extra online.
   */
  get maxExtraSeats(): number {
    return this.maxUsers !== null ? Math.max(0, this.maxUsers - 1) : 0
  }

  /** Valida que `extraSeats` sea un entero dentro de los límites del plan. */
  allowsExtraSeats(extraSeats: number): boolean {
    return Number.isInteger(extraSeats) && extraSeats >= 0 && extraSeats <= this.maxExtraSeats
  }

  /**
   * Precio mensual total con `extraSeats` usuarios adicionales, o `null` si el
   * plan no tiene precio fijo. Solo para mostrar: el cobro real lo calculan los
   * `price_...` de Stripe en el servidor.
   */
  totalPriceMonth(extraSeats: number): number | null {
    if (this.priceMonth === null) return null
    return this.priceMonth + extraSeats * EXTRA_SEAT_PRICE_MONTH
  }

  static fromPrimitive(data: PlanPrimitive): Plan {
    return new Plan(
      data.id,
      data.name,
      data.priceMonth,
      data.currency,
      data.maxUsers,
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
      maxUsers: this.maxUsers,
      capacity: this.capacity,
      custom: this.custom,
      features: this.features,
      stripePriceIdMonthly: this.stripePriceIdMonthly,
      stripePriceIdYearly: this.stripePriceIdYearly,
      highlighted: this.highlighted,
    }
  }
}
