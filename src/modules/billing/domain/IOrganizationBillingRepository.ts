/**
 * Puerto hacia el backend Amplify para el enlace organización↔Customer de
 * Stripe (ver docs/billing-multi-organizacion.md §3.2). Separado de
 * `modules/auth` porque billing solo necesita este único campo, no todo el
 * dominio de `Organization`.
 */
export interface IOrganizationBillingRepository {
  /** `stripeCustomerId` de la organización, o `null` si aún no tiene Customer. */
  getStripeCustomerId(organizationId: string): Promise<string | null>

  /** Persiste el Customer recién creado para que futuras requests no dupliquen. */
  setStripeCustomerId(organizationId: string, stripeCustomerId: string): Promise<void>
}
