import { StripePaymentMethodRepository } from '../infrastructure/StripePaymentMethodRepository'
import { StripeCardSetupGateway } from '../infrastructure/StripeCardSetupGateway'
import { StripeMetadataOrganizationBillingRepository } from '../infrastructure/StripeMetadataOrganizationBillingRepository'
import { GetPaymentMethods } from './GetPaymentMethods'
import { SetDefaultPaymentMethod } from './SetDefaultPaymentMethod'
import { RemovePaymentMethod } from './RemovePaymentMethod'
import { CreateCardSetupSession } from './CreateCardSetupSession'

/**
 * Factory de SOLO servidor para los métodos de pago de Stripe.
 *
 * Está separada de `factory.ts` a propósito (mismo criterio que
 * `subscriptionFactory.ts`): `factory.ts` se importa desde islands de
 * cliente, y este módulo instancia el SDK de Stripe con la clave secreta.
 * Este archivo solo debe importarse desde endpoints SSR (`src/pages/api/*`).
 *
 * `StripeMetadataOrganizationBillingRepository`: el backend Amplify aún no
 * expone cómo leer/persistir `stripeCustomerId` en `Organization` (ver
 * docs/billing-multi-organizacion.md §10 paso 1). Mientras tanto resuelve el
 * Customer buscando en Stripe por `metadata['organizationId']`. Sustituir
 * por la implementación HTTP real en cuanto exista.
 */
function organizationBillingRepository(secretKey: string) {
  return new StripeMetadataOrganizationBillingRepository(secretKey)
}

export function createGetPaymentMethodsUseCase(secretKey: string): GetPaymentMethods {
  return new GetPaymentMethods(
    new StripePaymentMethodRepository(secretKey, organizationBillingRepository(secretKey)),
  )
}

export function createSetDefaultPaymentMethodUseCase(
  secretKey: string,
): SetDefaultPaymentMethod {
  return new SetDefaultPaymentMethod(
    new StripePaymentMethodRepository(secretKey, organizationBillingRepository(secretKey)),
  )
}

export function createCardSetupSessionUseCase(secretKey: string): CreateCardSetupSession {
  return new CreateCardSetupSession(
    new StripeCardSetupGateway(secretKey, organizationBillingRepository(secretKey)),
  )
}

export function createRemovePaymentMethodUseCase(secretKey: string): RemovePaymentMethod {
  return new RemovePaymentMethod(
    new StripePaymentMethodRepository(secretKey, organizationBillingRepository(secretKey)),
  )
}
