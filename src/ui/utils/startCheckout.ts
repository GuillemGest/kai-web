import type { BillingPeriod } from '../../modules/billing/domain/Plan'
import type {
  BillingDetailsPrimitive,
  CustomerType,
} from '../../modules/billing/domain/BillingDetails'
import type { Locale } from '../../i18n/locales'

/**
 * Payload de facturación: `customerType` obligatorio + solo los campos
 * aplicables al modo elegido. Los del otro modo se omiten para no viajar
 * cadenas vacías al servidor (que ya no los espera).
 */
export type StartCheckoutBillingPayload = Partial<Omit<BillingDetailsPrimitive, 'customerType'>> & {
  customerType: CustomerType
}

interface StartCheckoutParams {
  planId: string
  period: BillingPeriod
  /** Usuarios adicionales al incluido en el plan. */
  seats: number
  userId: string
  /** Email de la cuenta: identifica al Customer para el límite de una suscripción por cuenta. */
  email: string
  billingDetails: StartCheckoutBillingPayload
  /** Idioma actual, para que las URLs de retorno de Stripe queden localizadas. */
  locale: Locale
}

/**
 * Error tipado del checkout: cuando el servidor rechaza por `code` conocido
 * (de momento solo el límite de una suscripción por cuenta), el island puede
 * distinguirlo de un fallo genérico sin parsear el texto del mensaje.
 */
export class CheckoutError extends Error {
  constructor(
    message: string,
    readonly code?: string,
  ) {
    super(message)
    this.name = 'CheckoutError'
  }
}

/**
 * Inicia el checkout de Stripe: pide al endpoint SSR una sesión de pago y
 * redirige el navegador a la pasarela alojada de Stripe.
 *
 * Vive en `ui/utils` (fuera de `modules/`) porque solo orquesta una llamada de
 * red desde la vista; la lógica de negocio (validación de plan, resolución de
 * precio, límite de suscripciones) está en el use case `CreateCheckoutSession`
 * del servidor.
 *
 * Lanza `CheckoutError` si el endpoint responde error, para que el island
 * muestre el fallo (y distinga el `code` si lo necesita).
 */
export async function startCheckout(params: StartCheckoutParams): Promise<void> {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  const data = (await res.json().catch(() => null)) as {
    url?: string
    error?: string
    code?: string
  } | null

  if (!res.ok || !data?.url) {
    throw new CheckoutError(data?.error ?? 'No se pudo iniciar el pago.', data?.code)
  }

  window.location.href = data.url
}
