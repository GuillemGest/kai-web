import type { APIRoute } from 'astro'
import { createCardSetupSessionUseCase } from '../../../modules/billing/application/paymentMethodFactory'
import { DEFAULT_LOCALE, isLocale, type Locale } from '../../../i18n/locales'

// Endpoint SSR: se ejecuta en el servidor, no se prerenderiza.
export const prerender = false

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Crea una sesión alojada de Stripe (Checkout en modo `setup`) para guardar
 * una tarjeta nueva en la cuenta, sin cobrar nada. Se abre en pestaña nueva
 * desde el cliente (mismo patrón que el pago de un upgrade): al terminar, el
 * usuario vuelve a /cuenta y la lista de tarjetas se refresca sola.
 *
 * Misma limitación de auth que el resto de /api/*: el email llega del
 * cliente. En producción conviene validar aquí el token de sesión contra el
 * backend de auth.
 */
export const POST: APIRoute = async ({ request, url }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return json({ error: 'Stripe no está configurado en el servidor.' }, 500)
  }

  let body: { email?: unknown; locale?: unknown }
  try {
    body = (await request.json()) as { email?: unknown; locale?: unknown }
  } catch {
    return json({ error: 'Body inválido.' }, 400)
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  if (!EMAIL_PATTERN.test(email)) {
    return json({ error: 'email es obligatorio y debe ser válido.' }, 400)
  }
  const lang: Locale = isLocale(body.locale) ? body.locale : DEFAULT_LOCALE

  const origin = url.origin
  // Vuelve siempre a la sección de facturación de la cuenta, éxito o cancelación:
  // no hay nada que deshacer si el usuario cancela un guardado de tarjeta.
  const returnUrl = `${origin}/${lang}/cuenta#billing`

  try {
    const session = await createCardSetupSessionUseCase(secretKey).execute({
      email,
      successUrl: returnUrl,
      cancelUrl: returnUrl,
    })
    return json({ url: session.url }, 200)
  } catch (error) {
    // No filtrar detalles internos de Stripe al cliente; el detalle queda en el log.
    console.error('[payment-methods/setup-session] error creando la sesión:', error)
    return json({ error: 'No se pudo iniciar el guardado de la tarjeta.' }, 502)
  }
}
