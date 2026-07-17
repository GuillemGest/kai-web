import type { APIRoute } from 'astro'
import { createCancelSubscriptionUseCase } from '../../../modules/billing/application/subscriptionFactory'
import {
  SubscriptionNotFoundError,
  SubscriptionNotManageableError,
} from '../../../modules/billing/domain/subscriptionErrors'

// Endpoint SSR: se ejecuta en el servidor, no se prerenderiza.
export const prerender = false

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Programa la baja de la suscripción al final del periodo ya pagado
 * (`cancel_at_period_end`): no corta el acceso ni reembolsa. El use case, vía
 * el repo de Stripe, verifica que la suscripción pertenece a la organización
 * indicada.
 *
 * TODO(billing-multi-org, seguridad): este endpoint NO verifica que el
 * usuario pertenezca a `organizationId` — falta `assertOrganizationAccess`
 * contra el token `Authorization: Bearer`, ver
 * docs/billing-multi-organizacion.md §6 y §7.1.
 */
export const POST: APIRoute = async ({ request }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return json({ error: 'Stripe no está configurado en el servidor.' }, 500)
  }

  let body: { organizationId?: unknown; subscriptionId?: unknown }
  try {
    body = (await request.json()) as { organizationId?: unknown; subscriptionId?: unknown }
  } catch {
    return json({ error: 'Body inválido.' }, 400)
  }

  const organizationId = typeof body.organizationId === 'string' ? body.organizationId.trim() : ''
  const subscriptionId = typeof body.subscriptionId === 'string' ? body.subscriptionId.trim() : ''
  if (!organizationId) {
    return json({ error: 'organizationId es obligatorio.' }, 400)
  }
  if (!subscriptionId) {
    return json({ error: 'subscriptionId es obligatorio.' }, 400)
  }

  try {
    await createCancelSubscriptionUseCase(secretKey).execute(organizationId, subscriptionId)
    return json({ ok: true }, 200)
  } catch (error) {
    if (error instanceof SubscriptionNotFoundError) {
      return json({ error: 'Suscripción no encontrada.' }, 404)
    }
    if (error instanceof SubscriptionNotManageableError) {
      return json({ error: 'Esta suscripción no se puede cancelar.' }, 409)
    }
    console.error('[subscriptions/cancel] error cancelando la suscripción:', error)
    return json({ error: 'No se pudo cancelar la suscripción.' }, 502)
  }
}
