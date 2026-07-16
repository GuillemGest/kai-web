import type { APIRoute } from 'astro'
import { createRemovePaymentMethodUseCase } from '../../../modules/billing/application/paymentMethodFactory'
import {
  PaymentMethodNotFoundError,
  CannotRemoveOnlyPaymentMethodError,
} from '../../../modules/billing/domain/paymentMethodErrors'

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
 * Elimina una tarjeta guardada del Customer en Stripe. El use case, vía el
 * repo de Stripe, verifica que la tarjeta pertenece al email indicado y
 * bloquea el borrado si es la predeterminada y hay suscripciones activas.
 *
 * Misma limitación de auth que el resto de /api/*: la sesión vive en
 * localStorage, así que el email llega del cliente. La titularidad se
 * comprueba contra Stripe (email del Customer ↔ tarjeta), pero en producción
 * conviene validar además el token de sesión contra el backend de auth.
 */
export const POST: APIRoute = async ({ request }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    return json({ error: 'Stripe no está configurado en el servidor.' }, 500)
  }

  let body: { email?: unknown; paymentMethodId?: unknown }
  try {
    body = (await request.json()) as { email?: unknown; paymentMethodId?: unknown }
  } catch {
    return json({ error: 'Body inválido.' }, 400)
  }

  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const paymentMethodId =
    typeof body.paymentMethodId === 'string' ? body.paymentMethodId.trim() : ''
  if (!EMAIL_PATTERN.test(email)) {
    return json({ error: 'email es obligatorio y debe ser válido.' }, 400)
  }
  if (!paymentMethodId) {
    return json({ error: 'paymentMethodId es obligatorio.' }, 400)
  }

  try {
    await createRemovePaymentMethodUseCase(secretKey).execute(email, paymentMethodId)
    return json({ ok: true }, 200)
  } catch (error) {
    if (error instanceof PaymentMethodNotFoundError) {
      return json({ error: 'Método de pago no encontrado.' }, 404)
    }
    if (error instanceof CannotRemoveOnlyPaymentMethodError) {
      return json(
        { error: 'No se puede eliminar la tarjeta predeterminada con suscripciones activas.' },
        409,
      )
    }
    console.error('[payment-methods/remove] error eliminando la tarjeta:', error)
    return json({ error: 'No se pudo eliminar la tarjeta.' }, 502)
  }
}
