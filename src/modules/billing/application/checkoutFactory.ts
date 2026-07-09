import { InMemoryPlanRepository } from '../infrastructure/InMemoryPlanRepository'
import { StripeCheckoutGateway } from '../infrastructure/StripeCheckoutGateway'
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
  const checkoutGateway = new StripeCheckoutGateway(secretKey)
  return new CreateCheckoutSession(planRepository, checkoutGateway)
}
