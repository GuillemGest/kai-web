import type { APIRoute } from 'astro'
import { createCardSetupSessionUseCase } from '../../../modules/billing/application/paymentMethodFactory'
import { DEFAULT_LOCALE, isLocale, type Locale } from '../../../i18n/locales'

// Endpoint SSR: se ejecuta en el servidor, no se prerenderiza.
export const prerender = false

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Crea una sesión alojada de Stripe (Checkout en modo `setup`) para guardar
 * una tarjeta nueva en la organización, sin cobrar nada. Se abre en pestaña
 * nueva desde el cliente (mismo patrón que el pago de un upgrade): al
 * terminar, el usuario vuelve a /cuenta y la lista de tarjetas se refresca
 * sola.
 *
 * TODO(billing-multi-org, seguridad): este endpoint NO verifica que el
 * usuario pertenezca a `organizationId` — falta `assertOrganizationAccess`
 * contra el token `Authorization: Bearer`, ver
 * docs/billing-multi-organizacion.md §6 y §7.1.
 */
export const POST: APIRoute = async ({ request, url }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return json({ error: 'Stripe no está configurado en el servidor.' }, 500)
  }

  let body: { organizationId?: unknown; locale?: unknown }
  try {
    body = (await request.json()) as { organizationId?: unknown; locale?: unknown }
  } catch {
    return json({ error: 'Body inválido.' }, 400)
  }

  const organizationId = typeof body.organizationId === 'string' ? body.organizationId.trim() : ''
  if (!organizationId) {
    return json({ error: 'organizationId es obligatorio.' }, 400)
  }
  const lang: Locale = isLocale(body.locale) ? body.locale : DEFAULT_LOCALE

  const origin = url.origin
  // Vuelve siempre a la sección de facturación de la cuenta, éxito o cancelación:
  // no hay nada que deshacer si el usuario cancela un guardado de tarjeta.
  const returnUrl = `${origin}/${lang}/cuenta#billing`

  try {
    const session = await createCardSetupSessionUseCase(secretKey).execute({
      organizationId,
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
