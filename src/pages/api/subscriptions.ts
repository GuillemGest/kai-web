import type { APIRoute } from 'astro'
import { createSubscriptionsUseCase } from '../../modules/billing/application/subscriptionFactory'

// Endpoint SSR: se ejecuta en el servidor, no se prerenderiza.
export const prerender = false

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Suscripciones de la organización en Stripe. Puede tener varios planes a la
 * vez: se devuelven todas (`{ subscriptions: [] }` si no está suscrita a nada).
 *
 * TODO(billing-multi-org, seguridad): este endpoint NO verifica que el
 * usuario pertenezca a `organizationId` — falta `assertOrganizationAccess`
 * contra el token `Authorization: Bearer`, ver
 * docs/billing-multi-organizacion.md §6 y §7.1.
 */
export const GET: APIRoute = async ({ url }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return json({ error: 'Stripe no está configurado en el servidor.' }, 500)
  }

  const organizationId = url.searchParams.get('organizationId')?.trim() ?? ''
  if (!organizationId) {
    return json({ error: 'organizationId es obligatorio.' }, 400)
  }

  try {
    const subscriptions = await createSubscriptionsUseCase(secretKey).execute(organizationId)
    return json({ subscriptions: subscriptions.map((sub) => sub.toPrimitive()) }, 200)
  } catch (error) {
    // No filtrar detalles internos de Stripe al cliente; el detalle queda en el log.
    console.error('[subscriptions] error consultando las suscripciones:', error)
    return json({ error: 'No se pudieron cargar las suscripciones.' }, 502)
  }
}
