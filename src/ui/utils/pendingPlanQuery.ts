/**
 * Contexto de compra pendiente (`?plan=<id>&seats=<n>`) que viaja por la URL
 * a través de planes → login → registro → confirmar cuenta → checkout, para
 * que el usuario retome la compra exactamente donde la dejó.
 * Compartido por LoginApp, RegisterApp, ConfirmAccountApp y CheckoutWizard.
 */
export interface PendingPlan {
  planId: string
  /** Usuarios adicionales elegidos en el wizard (0 si no venía en la URL). */
  seats: number
}

export function pendingPlanFromQuery(): PendingPlan | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  const planId = params.get('plan')
  if (!planId) return null
  const seats = Number(params.get('seats'))
  return { planId, seats: Number.isInteger(seats) && seats > 0 ? seats : 0 }
}

/**
 * Query string listo para encadenar a un href (`?plan=X&seats=N`), o cadena
 * vacía si no hay plan pendiente en la URL actual.
 */
export function pendingPlanQueryString(): string {
  const pending = pendingPlanFromQuery()
  if (!pending) return ''
  return `?plan=${encodeURIComponent(pending.planId)}${pending.seats > 0 ? `&seats=${pending.seats}` : ''}`
}
