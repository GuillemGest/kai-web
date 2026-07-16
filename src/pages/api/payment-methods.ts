import type { APIRoute } from 'astro'
import { createGetPaymentMethodsUseCase } from '../../modules/billing/application/paymentMethodFactory'

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
 * Tarjetas guardadas del usuario en Stripe, por su email de facturación. Un
 * Customer puede tener varias; se devuelven todas (`{ paymentMethods: [] }` si
 * no tiene ninguna), marcando con `isDefault` la que cobra la renovación.
 *
 * Nota de seguridad: misma limitación que /api/subscriptions y /api/invoices —
 * la sesión vive en localStorage, así que el email llega del cliente. Suficiente
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
    const paymentMethods = await createGetPaymentMethodsUseCase(secretKey).execute(email)
    return json({ paymentMethods: paymentMethods.map((pm) => pm.toPrimitive()) }, 200)
  } catch (error) {
    // No filtrar detalles internos de Stripe al cliente; el detalle queda en el log.
    console.error('[payment-methods] error consultando las tarjetas:', error)
    return json({ error: 'No se pudieron cargar los métodos de pago.' }, 502)
  }
}
