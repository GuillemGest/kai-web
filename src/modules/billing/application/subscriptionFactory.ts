import { InMemoryPlanRepository } from '../infrastructure/InMemoryPlanRepository'
import { StripeSubscriptionRepository } from '../infrastructure/StripeSubscriptionRepository'
import { GetSubscriptions } from './GetSubscriptions'

/**
 * Factory de SOLO servidor para las suscripciones de Stripe.
 *
 * Está separada de `factory.ts` a propósito (mismo criterio que
 * `checkoutFactory.ts` e `invoicesFactory.ts`): `factory.ts` se importa desde
 * islands de cliente, y este módulo instancia el SDK de Stripe con la clave
 * secreta. Este archivo solo debe importarse desde endpoints SSR
 * (`src/pages/api/*`).
 *
 * El repositorio de planes se inyecta para poder traducir el `price_...` de
 * Stripe a nuestro planId cuando la suscripción no lleva metadata propia.
 */
export function createSubscriptionsUseCase(secretKey: string) {
  return new GetSubscriptions(
    new StripeSubscriptionRepository(secretKey, new InMemoryPlanRepository()),
  )
}
