import type { APIRoute } from 'astro'
import { createGetPaymentMethodsUseCase } from '../../modules/billing/application/paymentMethodFactory'

// Endpoint SSR: se ejecuta en el servidor, no se prerenderiza.
export const prerender = false

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

/**
 * Tarjetas guardadas de la organización en Stripe. Un Customer puede tener
 * varias; se devuelven todas (`{ paymentMethods: [] }` si no tiene ninguna),
 * marcando con `isDefault` la que cobra la renovación.
 *
 * TODO(billing-multi-org, seguridad): este endpoint NO verifica que el
 * usuario pertenezca a `organizationId` — cualquiera que conozca/adivine un
 * id puede leer las tarjetas de esa organización (IDOR). Falta añadir
 * `assertOrganizationAccess` contra el token `Authorization: Bearer` antes de
 * usar `organizationId`, ver docs/billing-multi-organizacion.md §6 y §7.1.
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
    const paymentMethods = await createGetPaymentMethodsUseCase(secretKey).execute(organizationId)
    return json({ paymentMethods: paymentMethods.map((pm) => pm.toPrimitive()) }, 200)
  } catch (error) {
    // No filtrar detalles internos de Stripe al cliente; el detalle queda en el log.
    console.error('[payment-methods] error consultando las tarjetas:', error)
    return json({ error: 'No se pudieron cargar los métodos de pago.' }, 502)
  }
}
