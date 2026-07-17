import { InMemoryPlanRepository } from '../infrastructure/InMemoryPlanRepository'
import { StripeCheckoutGateway } from '../infrastructure/StripeCheckoutGateway'
import { StripeSubscriptionRepository } from '../infrastructure/StripeSubscriptionRepository'
import { StripeMetadataOrganizationBillingRepository } from '../infrastructure/StripeMetadataOrganizationBillingRepository'
import { CreateCheckoutSession } from './CreateCheckoutSession'

/**
 * Factory de SOLO servidor para el checkout de Stripe.
 *
 * Está separada de `factory.ts` a propósito: `factory.ts` se importa desde
 * islands de cliente (ShopPlans), y este módulo instancia el SDK de Stripe con
 * la clave secreta. Mantenerlos separados evita que la clave secreta acabe en
 * el bundle del navegador. Este archivo solo debe importarse desde endpoints
 * SSR (`src/pages/api/*`).
 *
 * Es una fábrica perezosa (función) en vez de una constante módulo-nivel para
 * que la ausencia de `STRIPE_SECRET_KEY` falle de forma controlada en la
 * request, no al cargar el módulo.
 */
export function createCheckoutUseCase(secretKey: string) {
  const planRepository = new InMemoryPlanRepository()
  // StripeMetadataOrganizationBillingRepository: el backend Amplify aún no
  // expone cómo leer/persistir stripeCustomerId (ver
  // docs/billing-multi-organizacion.md §10 paso 1). Mientras tanto resuelve
  // el Customer buscando en Stripe por metadata['organizationId']. Sustituir
  // por la implementación HTTP real en cuanto exista.
  const organizationBillingRepository = new StripeMetadataOrganizationBillingRepository(secretKey)
  const subscriptionRepository = new StripeSubscriptionRepository(
    secretKey,
    planRepository,
    organizationBillingRepository,
  )
  const checkoutGateway = new StripeCheckoutGateway(secretKey, organizationBillingRepository)
  // Precio recurrente del asiento extra (10 €/usuario/mes), leído aquí en el
  // composition root igual que la secret key: el use case no conoce env vars.
  const extraSeatPriceIds = {
    monthly: readPriceId('STRIPE_PRICE_EXTRA_SEAT_MONTHLY'),
    yearly: readPriceId('STRIPE_PRICE_EXTRA_SEAT_YEARLY'),
  }
  return new CreateCheckoutSession(
    planRepository,
    subscriptionRepository,
    checkoutGateway,
    extraSeatPriceIds,
  )
}

function readPriceId(key: string): string | null {
  const value = import.meta.env[key]
  return typeof value === 'string' && value.length > 0 ? value : null
}
