import { StripeInvoiceRepository } from '../infrastructure/StripeInvoiceRepository'
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
  return new GetInvoices(new StripeInvoiceRepository(secretKey))
}
