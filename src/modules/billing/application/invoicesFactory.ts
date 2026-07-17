import { StripeInvoiceRepository } from '../infrastructure/StripeInvoiceRepository'
import { StripeMetadataOrganizationBillingRepository } from '../infrastructure/StripeMetadataOrganizationBillingRepository'
import { GetInvoices } from './GetInvoices'

/**
 * Factory de SOLO servidor para las facturas de Stripe.
 *
 * Está separada de `factory.ts` a propósito (mismo criterio que
 * `checkoutFactory.ts`): `factory.ts` se importa desde islands de cliente, y
 * este módulo instancia el SDK de Stripe con la clave secreta. Este archivo
 * solo debe importarse desde endpoints SSR (`src/pages/api/*`).
 *
 * Fábrica perezosa (función) para que la ausencia de `STRIPE_SECRET_KEY`
 * falle de forma controlada en la request, no al cargar el módulo.
 */
export function createInvoicesUseCase(secretKey: string) {
  // StripeMetadataOrganizationBillingRepository: el backend Amplify aún no
  // expone cómo leer/persistir stripeCustomerId (ver
  // docs/billing-multi-organizacion.md §10 paso 1). Mientras tanto resuelve
  // el Customer buscando en Stripe por metadata['organizationId']. Sustituir
  // por la implementación HTTP real en cuanto exista.
  return new GetInvoices(
    new StripeInvoiceRepository(secretKey, new StripeMetadataOrganizationBillingRepository(secretKey)),
  )
}
