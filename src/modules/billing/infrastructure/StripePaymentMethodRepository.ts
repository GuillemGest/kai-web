import Stripe from 'stripe'
import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'
import { PaymentMethod, type CardBrand } from '../domain/PaymentMethod'
import {
  PaymentMethodNotFoundError,
  CannotRemoveOnlyPaymentMethodError,
} from '../domain/paymentMethodErrors'
import type { IOrganizationBillingRepository } from '../domain/IOrganizationBillingRepository'
import { resolveCustomerId } from './resolveCustomerId'

/**
 * Tarjetas guardadas desde Stripe. SOLO servidor: instancia el SDK con la
 * clave secreta (inyectada por constructor), así que debe usarse únicamente
 * detrás de endpoints SSR (`src/pages/api/*`) vía `paymentMethodFactory`.
 *
 * La búsqueda es por `stripeCustomerId` de la organización (identidad de
 * facturación, igual que suscripciones y facturas) — un Customer 1:1 por
 * organización, resuelto vía `resolveCustomerId`. La tarjeta "por defecto" es
 * la que cobra la renovación automática — `invoice_settings.default_payment_method`
 * del Customer, NO la más reciente añadida.
 */
export class StripePaymentMethodRepository implements IPaymentMethodRepository {
  private readonly stripe: Stripe

  constructor(
    secretKey: string,
    private readonly organizationBillingRepository: IOrganizationBillingRepository,
  ) {
    this.stripe = new Stripe(secretKey)
  }

  async listByOrganization(organizationId: string): Promise<PaymentMethod[]> {
    const customerId = await resolveCustomerId(
      this.stripe,
      this.organizationBillingRepository,
      organizationId,
    )
    const customer = await this.stripe.customers.retrieve(customerId)
    if (customer.deleted) return []

    const methods = await this.stripe.paymentMethods.list({ customer: customerId, type: 'card' })
    const defaultId = defaultPaymentMethodIdOf(customer)

    return methods.data
      .map((pm) => toDomain(pm, pm.id === defaultId))
      .sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
  }

  async setDefault(organizationId: string, paymentMethodId: string): Promise<void> {
    const customerId = await resolveCustomerId(
      this.stripe,
      this.organizationBillingRepository,
      organizationId,
    )
    await this.assertOwnsPaymentMethod(customerId, paymentMethodId)

    await this.stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    })
  }

  async remove(organizationId: string, paymentMethodId: string): Promise<void> {
    const customerId = await resolveCustomerId(
      this.stripe,
      this.organizationBillingRepository,
      organizationId,
    )
    const customer = await this.assertOwnsPaymentMethod(customerId, paymentMethodId)

    // Si es la predeterminada, eliminarla dejaría sin tarjeta de cobro la
    // próxima renovación mientras haya suscripciones activas: se bloquea
    // aquí en vez de dejar que Stripe se quede sin `default_payment_method`.
    const isDefault = defaultPaymentMethodIdOf(customer) === paymentMethodId
    if (isDefault) {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      })
      if (subscriptions.data.length > 0) {
        throw new CannotRemoveOnlyPaymentMethodError(paymentMethodId)
      }
    }

    await this.stripe.paymentMethods.detach(paymentMethodId)
  }

  /**
   * Verifica que `paymentMethodId` pertenece al Customer resuelto de la
   * organización antes de actuar sobre él — un id de otro Customer no debe
   * poder tocarse solo porque el caller conoce su valor (ver
   * docs/billing-multi-organizacion.md §7.2).
   */
  private async assertOwnsPaymentMethod(
    customerId: string,
    paymentMethodId: string,
  ): Promise<Stripe.Customer> {
    const customer = await this.stripe.customers.retrieve(customerId)
    if (customer.deleted) throw new PaymentMethodNotFoundError(paymentMethodId)

    const methods = await this.stripe.paymentMethods.list({ customer: customerId, type: 'card' })
    const owns = methods.data.some((pm) => pm.id === paymentMethodId)
    if (!owns) throw new PaymentMethodNotFoundError(paymentMethodId)

    return customer
  }
}

/** `invoice_settings.default_payment_method` puede venir como id o expandido; aquí solo pedimos el id. */
function defaultPaymentMethodIdOf(customer: Stripe.Customer): string | null {
  const pm = customer.invoice_settings?.default_payment_method
  return typeof pm === 'string' ? pm : (pm?.id ?? null)
}

function toDomain(pm: Stripe.PaymentMethod, isDefault: boolean): PaymentMethod {
  const card = pm.card
  // `userId` aquí es solo informativo (el `stripeCustomerId` de la organización
  // es la identidad real de titularidad, verificada en el repo); se guarda el
  // id del Customer sin asumir que venga expandido.
  const customerId = typeof pm.customer === 'string' ? pm.customer : (pm.customer?.id ?? '')
  return PaymentMethod.fromPrimitive({
    id: pm.id,
    userId: customerId,
    brand: mapBrand(card?.brand),
    last4: card?.last4 ?? '····',
    expMonth: card?.exp_month ?? 0,
    expYear: card?.exp_year ?? 0,
    holderName: pm.billing_details?.name ?? '',
    isDefault,
  })
}

function mapBrand(brand: string | undefined): CardBrand {
  switch (brand) {
    case 'visa':
      return 'visa'
    case 'mastercard':
      return 'mastercard'
    case 'amex':
      return 'amex'
    default:
      return 'other'
  }
}
