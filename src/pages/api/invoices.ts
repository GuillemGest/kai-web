import type { APIRoute } from 'astro'
import { createInvoicesUseCase } from '../../modules/billing/application/invoicesFactory'

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
 * Facturas del usuario desde Stripe, filtradas por su email de facturación.
 *
 * Nota de seguridad: la sesión de KAI vive en localStorage (cliente), así que
 * el servidor no puede derivar el usuario aquí; el island envía el email por
 * query. Es suficiente para la demo en modo test. Para producción conviene
 * mover la sesión a cookie httpOnly y validar aquí el token contra el backend
 * de auth (evita que alguien liste facturas de otro email).
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
    const invoices = await createInvoicesUseCase(secretKey).execute(email)
    return json({ invoices: invoices.map((invoice) => invoice.toPrimitive()) }, 200)
  } catch (error) {
    // No filtrar detalles internos de Stripe al cliente; el detalle queda en el log.
    console.error('[invoices] error listando facturas:', error)
    return json({ error: 'No se pudieron cargar las facturas.' }, 502)
  }
}
