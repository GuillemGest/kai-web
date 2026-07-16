import Stripe from 'stripe'
import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'
import { PaymentMethod, type CardBrand } from '../domain/PaymentMethod'
import { PaymentMethodNotFoundError } from '../domain/paymentMethodErrors'

/**
 * Tarjetas guardadas desde Stripe. SOLO servidor: instancia el SDK con la
 * clave secreta (inyectada por constructor), así que debe usarse únicamente
 * detrás de endpoints SSR (`src/pages/api/*`) vía `paymentMethodFactory`.
 *
 * La búsqueda es por email (identidad de facturación, igual que suscripciones
 * y facturas): agrega las tarjetas de todos los Customers con ese email. La
 * tarjeta "por defecto" es la que cobra la renovación automática —
 * `invoice_settings.default_payment_method` del Customer, NO la más reciente
 * añadida.
 */
export class StripePaymentMethodRepository implements IPaymentMethodRepository {
  private readonly stripe: Stripe

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey)
  }

  async listByEmail(email: string): Promise<PaymentMethod[]> {
    const customers = await this.stripe.customers.list({ email, limit: 10 })
    if (customers.data.length === 0) return []

    const methodsPerCustomer = await Promise.all(
      customers.data.map(async (customer) => {
        const methods = await this.stripe.paymentMethods.list({
          customer: customer.id,
          type: 'card',
        })
        const defaultId = defaultPaymentMethodIdOf(customer)
        return methods.data.map((pm) => toDomain(pm, pm.id === defaultId))
      }),
    )

    // Predeterminada primero; a igualdad, sin orden garantizado más allá del
    // que devuelve Stripe (inserción).
    return methodsPerCustomer.flat().sort((a, b) => Number(b.isDefault) - Number(a.isDefault))
  }

  async setDefault(email: string, paymentMethodId: string): Promise<void> {
    const customers = await this.stripe.customers.list({ email, limit: 10 })

    for (const customer of customers.data) {
      const methods = await this.stripe.paymentMethods.list({
        customer: customer.id,
        type: 'card',
      })
      const owns = methods.data.some((pm) => pm.id === paymentMethodId)
      if (!owns) continue

      await this.stripe.customers.update(customer.id, {
        invoice_settings: { default_payment_method: paymentMethodId },
      })
      return
    }

    // Ninguno de los Customers de este email tiene esa tarjeta.
    throw new PaymentMethodNotFoundError(paymentMethodId)
  }
}

/** `invoice_settings.default_payment_method` puede venir como id o expandido; aquí solo pedimos el id. */
function defaultPaymentMethodIdOf(customer: Stripe.Customer): string | null {
  const pm = customer.invoice_settings?.default_payment_method
  return typeof pm === 'string' ? pm : (pm?.id ?? null)
}

function toDomain(pm: Stripe.PaymentMethod, isDefault: boolean): PaymentMethod {
  const card = pm.card
  // `userId` aquí es solo informativo (el email es la identidad real de
  // titularidad, verificada en el repo); se guarda el id del Customer sin
  // asumir que venga expandido.
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
