import type { APIRoute } from 'astro'
import { createSetDefaultPaymentMethodUseCase } from '../../../modules/billing/application/paymentMethodFactory'
import { PaymentMethodNotFoundError } from '../../../modules/billing/domain/paymentMethodErrors'

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
 * Marca una tarjeta guardada como predeterminada: la que Stripe usará para
 * cobrar la próxima renovación de cualquier suscripción del Customer. El use
 * case, vía el repo de Stripe, verifica que la tarjeta pertenece al email
 * indicado.
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
    await createSetDefaultPaymentMethodUseCase(secretKey).execute(email, paymentMethodId)
    return json({ ok: true }, 200)
  } catch (error) {
    if (error instanceof PaymentMethodNotFoundError) {
      return json({ error: 'Método de pago no encontrado.' }, 404)
    }
    console.error('[payment-methods/set-default] error actualizando la tarjeta:', error)
    return json({ error: 'No se pudo actualizar la tarjeta predeterminada.' }, 502)
  }
}
