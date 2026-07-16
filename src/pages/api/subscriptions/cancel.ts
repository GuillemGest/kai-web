import type { APIRoute } from 'astro'
import { createCancelSubscriptionUseCase } from '../../../modules/billing/application/subscriptionFactory'
import {
  SubscriptionNotFoundError,
  SubscriptionNotManageableError,
} from '../../../modules/billing/domain/subscriptionErrors'

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
 * Programa la baja de la suscripción al final del periodo ya pagado
 * (`cancel_at_period_end`): no corta el acceso ni reembolsa. El use case, vía
 * el repo de Stripe, verifica que la suscripción pertenece al email indicado.
 *
 * Misma limitación de auth que el resto de /api/*: la sesión vive en
 * localStorage, así que el email llega del cliente. La titularidad se comprueba
 * contra Stripe (email del Customer ↔ suscripción), pero en producción conviene
 * validar además el token de sesión contra el backend de auth.
 */
export const POST: APIRoute = async ({ request }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return json({ error: 'Stripe no está configurado en el servidor.' }, 500)
  }

  let body: { email?: unknown; subscriptionId?: unknown }
  try {
    body = (await request.json()) as { email?: unknown; subscriptionId?: unknown }
  } catch {
    return json({ error: 'Body inválido.' }, 400)
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const subscriptionId = typeof body.subscriptionId === 'string' ? body.subscriptionId.trim() : ''
  if (!EMAIL_PATTERN.test(email)) {
    return json({ error: 'email es obligatorio y debe ser válido.' }, 400)
  }
  if (!subscriptionId) {
    return json({ error: 'subscriptionId es obligatorio.' }, 400)
  }

  try {
    await createCancelSubscriptionUseCase(secretKey).execute(email, subscriptionId)
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
