import { StripePaymentMethodRepository } from '../infrastructure/StripePaymentMethodRepository'
import { StripeCardSetupGateway } from '../infrastructure/StripeCardSetupGateway'
import { GetPaymentMethods } from './GetPaymentMethods'
import { SetDefaultPaymentMethod } from './SetDefaultPaymentMethod'
import { CreateCardSetupSession } from './CreateCardSetupSession'

/**
 * Factory de SOLO servidor para los métodos de pago de Stripe.
 *
 * Está separada de `factory.ts` a propósito (mismo criterio que
 * `subscriptionFactory.ts`): `factory.ts` se importa desde islands de
 * cliente, y este módulo instancia el SDK de Stripe con la clave secreta.
 * Este archivo solo debe importarse desde endpoints SSR (`src/pages/api/*`).
 */
export function createGetPaymentMethodsUseCase(secretKey: string): GetPaymentMethods {
  return new GetPaymentMethods(new StripePaymentMethodRepository(secretKey))
}

export function createSetDefaultPaymentMethodUseCase(
  secretKey: string,
): SetDefaultPaymentMethod {
  return new SetDefaultPaymentMethod(new StripePaymentMethodRepository(secretKey))
}

export function createCardSetupSessionUseCase(secretKey: string): CreateCardSetupSession {
  return new CreateCardSetupSession(new StripeCardSetupGateway(secretKey))
}
