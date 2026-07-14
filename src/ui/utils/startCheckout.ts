import type { BillingPeriod } from '../../modules/billing/domain/Plan'
import type { BillingDetailsPrimitive } from '../../modules/billing/domain/BillingDetails'
import type { Locale } from '../../i18n/locales'

interface StartCheckoutParams {
  planId: string
  period: BillingPeriod
  /** Usuarios adicionales al incluido en el plan. */
  seats: number
  userId: string
  billingDetails: BillingDetailsPrimitive
  /** Idioma actual, para que las URLs de retorno de Stripe queden localizadas. */
  locale: Locale
}

/**
 * Inicia el checkout de Stripe: pide al endpoint SSR una sesión de pago y
 * redirige el navegador a la pasarela alojada de Stripe.
 *
 * Vive en `ui/utils` (fuera de `modules/`) porque solo orquesta una llamada de
 * red desde la vista; la lógica de negocio (validación de plan, resolución de
 * precio) está en el use case `CreateCheckoutSession` del servidor.
 *
 * Lanza si el endpoint responde error, para que el island muestre el fallo.
 */
export async function startCheckout(params: StartCheckoutParams): Promise<void> {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null

  if (!res.ok || !data?.url) {
    throw new Error(data?.error ?? 'No se pudo iniciar el pago.')
  }

  window.location.href = data.url
}
