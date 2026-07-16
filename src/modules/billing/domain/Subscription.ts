export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'none'

export interface SubscriptionPrimitive {
  id: string
  userId: string
  planId: string
  status: SubscriptionStatus
  currentPeriodEnd: string
  stripeSubscriptionId: string | null
  /**
   * Baja programada: la suscripción sigue activa hasta `currentPeriodEnd` y no
   * se renovará (equivale a `cancel_at_period_end` de Stripe). Mientras no
   * llegue esa fecha, la baja se puede revertir (reactivar).
   */
  cancelAtPeriodEnd: boolean
  /**
   * Downgrade programado: plan que entrará en vigor en la siguiente renovación
   * (los downgrades no se aplican en caliente: se disfruta el plan pagado hasta
   * fin de periodo). `null` si no hay cambio pendiente.
   */
  pendingPlanId: string | null
}

export class Subscription {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly planId: string,
    readonly status: SubscriptionStatus,
    readonly currentPeriodEnd: string,
    readonly stripeSubscriptionId: string | null,
    readonly cancelAtPeriodEnd: boolean,
    readonly pendingPlanId: string | null,
  ) {}

  get isActive(): boolean {
    return this.status === 'active'
  }

  /** Activa pero con baja programada: se puede reactivar hasta `currentPeriodEnd`. */
  get isEnding(): boolean {
    return this.isActive && this.cancelAtPeriodEnd
  }

  /** ¿Admite operaciones de gestión (cancelar / cambiar de plan)? */
  get isManageable(): boolean {
    return this.isActive && this.stripeSubscriptionId !== null
  }

  static fromPrimitive(data: SubscriptionPrimitive): Subscription {
    return new Subscription(
      data.id,
      data.userId,
      data.planId,
      data.status,
      data.currentPeriodEnd,
      data.stripeSubscriptionId,
      data.cancelAtPeriodEnd,
      data.pendingPlanId,
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
      cancelAtPeriodEnd: this.cancelAtPeriodEnd,
      pendingPlanId: this.pendingPlanId,
    }
  }
}
