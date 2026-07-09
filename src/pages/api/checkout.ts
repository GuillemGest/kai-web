import type { APIRoute } from 'astro'
import { createCheckoutUseCase } from '../../modules/billing/application/checkoutFactory'
import {
  PlanNotFoundError,
  PlanNotPurchasableError,
} from '../../modules/billing/application/CreateCheckoutSession'
import type { BillingPeriod } from '../../modules/billing/domain/Plan'

// Endpoint SSR: se ejecuta en el servidor, no se prerenderiza.
export const prerender = false

interface CheckoutBody {
  planId?: unknown
  period?: unknown
  userId?: unknown
  customerEmail?: unknown
}

function isPeriod(value: unknown): value is BillingPeriod {
  return value === 'monthly' || value === 'yearly'
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Entrypoint delgado del checkout: valida input y delega en UN use case.
 *
 * Nota de seguridad: la sesión de KAI vive en localStorage (cliente), así que el
 * servidor no puede derivar el usuario aquí; el island envía `userId`/`email` en
 * el body. Es suficiente para la demo en modo test. Para producción conviene
 * mover la sesión a cookie httpOnly y validar aquí el token contra el backend
 * de auth antes de cobrar (evita que alguien inicie checkouts a nombre de otro).
 */
export const POST: APIRoute = async ({ request, url }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return json({ error: 'Stripe no está configurado en el servidor.' }, 500)
  }

  let body: CheckoutBody
  try {
    body = (await request.json()) as CheckoutBody
  } catch {
    return json({ error: 'Body inválido.' }, 400)
  }

  const { planId, period, userId, customerEmail } = body
  if (typeof planId !== 'string' || !planId) {
    return json({ error: 'planId es obligatorio.' }, 400)
  }
  if (!isPeriod(period)) {
    return json({ error: "period debe ser 'monthly' o 'yearly'." }, 400)
  }
  if (typeof userId !== 'string' || !userId) {
    return json({ error: 'Debes iniciar sesión para comprar.' }, 401)
  }
  const email = typeof customerEmail === 'string' && customerEmail ? customerEmail : null

  const origin = url.origin
  const createCheckout = createCheckoutUseCase(secretKey)

  try {
    const session = await createCheckout.execute({
      planId,
      period,
      userId,
      customerEmail: email,
      successUrl: `${origin}/checkout/gracias?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/planes`,
    })
    return json({ url: session.url }, 200)
  } catch (error) {
    if (error instanceof PlanNotFoundError) {
      return json({ error: 'Plan no encontrado.' }, 404)
    }
    if (error instanceof PlanNotPurchasableError) {
      return json({ error: 'Este plan no se puede comprar online.' }, 409)
    }
    // No filtrar detalles internos de Stripe al cliente; el detalle queda en el log.
    console.error('[checkout] error creando la sesión:', error)
    return json({ error: 'No se pudo iniciar el pago.' }, 502)
  }
}
