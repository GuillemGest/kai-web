import { InMemoryPlanRepository } from '../infrastructure/InMemoryPlanRepository'
import { StripeSubscriptionRepository } from '../infrastructure/StripeSubscriptionRepository'
import { StripeMetadataOrganizationBillingRepository } from '../infrastructure/StripeMetadataOrganizationBillingRepository'
import { GetSubscriptions } from './GetSubscriptions'
import { CancelSubscription } from './CancelSubscription'
import { ReactivateSubscription } from './ReactivateSubscription'
import { ChangeSubscriptionPlan } from './ChangeSubscriptionPlan'

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
 * Stripe a nuestro planId cuando la suscripción no lleva metadata propia, y
 * para resolver el plan de destino al cambiar de plan.
 *
 * Cada `create*UseCase` compone dependencias y devuelve UN use case: la factory
 * no orquesta ni llama a métodos de repositorio (eso lo hace el use case).
 */
function buildDependencies(secretKey: string) {
  const planRepository = new InMemoryPlanRepository()
  // StripeMetadataOrganizationBillingRepository: el backend Amplify aún no
  // expone cómo leer/persistir stripeCustomerId (ver
  // docs/billing-multi-organizacion.md §10 paso 1). Mientras tanto resuelve
  // el Customer buscando en Stripe por metadata['organizationId']. Sustituir
  // por la implementación HTTP real en cuanto exista.
  const subscriptionRepository = new StripeSubscriptionRepository(
    secretKey,
    planRepository,
    new StripeMetadataOrganizationBillingRepository(secretKey),
  )
  return { planRepository, subscriptionRepository }
}

export function createSubscriptionsUseCase(secretKey: string): GetSubscriptions {
  return new GetSubscriptions(buildDependencies(secretKey).subscriptionRepository)
}

export function createCancelSubscriptionUseCase(secretKey: string): CancelSubscription {
  return new CancelSubscription(buildDependencies(secretKey).subscriptionRepository)
}

export function createReactivateSubscriptionUseCase(secretKey: string): ReactivateSubscription {
  return new ReactivateSubscription(buildDependencies(secretKey).subscriptionRepository)
}

export function createChangeSubscriptionPlanUseCase(secretKey: string): ChangeSubscriptionPlan {
  const { planRepository, subscriptionRepository } = buildDependencies(secretKey)
  return new ChangeSubscriptionPlan(subscriptionRepository, planRepository)
}
