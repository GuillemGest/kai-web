import Stripe from 'stripe'
import type { IOrganizationBillingRepository } from '../domain/IOrganizationBillingRepository'

/**
 * Resuelve el Customer de Stripe de una organización: usa el id ya conocido
 * (vía `organizationBillingRepository`) o crea uno nuevo si aún no existe
 * (fallback de migración, ver docs/billing-multi-organizacion.md §4.1 y §9).
 * `metadata.organizationId` permite auditar/reconciliar desde el dashboard de
 * Stripe sin depender solo del backend propio.
 */
export async function resolveCustomerId(
  stripe: Stripe,
  organizationBillingRepository: IOrganizationBillingRepository,
  organizationId: string,
): Promise<string> {
  const existing = await organizationBillingRepository.getStripeCustomerId(organizationId)
  if (existing) return existing

  const customer = await stripe.customers.create({
    metadata: { organizationId },
  })
  await organizationBillingRepository.setStripeCustomerId(organizationId, customer.id)
  return customer.id
}
