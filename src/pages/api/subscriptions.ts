import type { APIRoute } from 'astro'
import { createSubscriptionsUseCase } from '../../modules/billing/application/subscriptionFactory'

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
 * Suscripciones del usuario en Stripe, por su email de facturación. Un usuario
 * puede tener varios planes a la vez: se devuelven todas (`{ subscriptions: [] }`
 * si no está suscrito a nada).
 *
 * Nota de seguridad: misma limitación que /api/checkout y /api/invoices — la
 * sesión vive en localStorage, así que el email llega del cliente. Suficiente
 * para la demo en test; en producción, validar aquí el token contra el backend
 * de auth.
 */
export const GET: APIRoute = async ({ url }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return json({ error: 'Stripe no está configurado en el servidor.' }, 500)
  }

  const email = url.searchParams.get('email')?.trim() ?? ''
  if (!EMAIL_PATTERN.test(email)) {
    return json({ error: 'email es obligatorio y debe ser válido.' }, 400)
  }

  try {
    const subscriptions = await createSubscriptionsUseCase(secretKey).execute(email)
    return json({ subscriptions: subscriptions.map((sub) => sub.toPrimitive()) }, 200)
  } catch (error) {
    // No filtrar detalles internos de Stripe al cliente; el detalle queda en el log.
    console.error('[subscriptions] error consultando las suscripciones:', error)
    return json({ error: 'No se pudieron cargar las suscripciones.' }, 502)
  }
}
