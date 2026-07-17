import type { APIRoute } from 'astro'
import { createSetDefaultPaymentMethodUseCase } from '../../../modules/billing/application/paymentMethodFactory'
import { PaymentMethodNotFoundError } from '../../../modules/billing/domain/paymentMethodErrors'

// Endpoint SSR: se ejecuta en el servidor, no se prerenderiza.
export const prerender = false

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Marca una tarjeta guardada como predeterminada: la que Stripe usará para
 * cobrar la próxima renovación de cualquier suscripción del Customer. El use
 * case, vía el repo de Stripe, verifica que la tarjeta pertenece a la
 * organización indicada.
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

  let body: { organizationId?: unknown; paymentMethodId?: unknown }
  try {
    body = (await request.json()) as { organizationId?: unknown; paymentMethodId?: unknown }
  } catch {
    return json({ error: 'Body inválido.' }, 400)
  }

  const organizationId = typeof body.organizationId === 'string' ? body.organizationId.trim() : ''
  const paymentMethodId =
    typeof body.paymentMethodId === 'string' ? body.paymentMethodId.trim() : ''
  if (!organizationId) {
    return json({ error: 'organizationId es obligatorio.' }, 400)
  }
  if (!paymentMethodId) {
    return json({ error: 'paymentMethodId es obligatorio.' }, 400)
  }

  try {
    await createSetDefaultPaymentMethodUseCase(secretKey).execute(organizationId, paymentMethodId)
    return json({ ok: true }, 200)
  } catch (error) {
    if (error instanceof PaymentMethodNotFoundError) {
      return json({ error: 'Método de pago no encontrado.' }, 404)
    }
    console.error('[payment-methods/set-default] error actualizando la tarjeta:', error)
    return json({ error: 'No se pudo actualizar la tarjeta predeterminada.' }, 502)
  }
}
