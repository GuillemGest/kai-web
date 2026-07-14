import type { APIRoute } from 'astro'
import { createCheckoutUseCase } from '../../modules/billing/application/checkoutFactory'
import {
  InvalidSeatCountError,
  PlanNotFoundError,
  PlanNotPurchasableError,
} from '../../modules/billing/application/CreateCheckoutSession'
import {
  InvalidBillingDetailsError,
  type BillingDetailsPrimitive,
} from '../../modules/billing/domain/BillingDetails'
import type { BillingPeriod } from '../../modules/billing/domain/Plan'
import { DEFAULT_LOCALE, isLocale, type Locale } from '../../i18n/locales'

// Endpoint SSR: se ejecuta en el servidor, no se prerenderiza.
export const prerender = false

interface CheckoutBody {
  planId?: unknown
  period?: unknown
  seats?: unknown
  userId?: unknown
  billingDetails?: unknown
  locale?: unknown
}

const BILLING_FIELDS: readonly (keyof BillingDetailsPrimitive)[] = [
  'legalName',
  'taxId',
  'billingEmail',
  'addressLine',
  'city',
  'postalCode',
  'province',
  'country',
]

function isPeriod(value: unknown): value is BillingPeriod {
  return value === 'monthly' || value === 'yearly'
}

/**
 * Comprobación de FORMA (todas las claves son string): la validación de
 * contenido (patrones, normalización) la hace el value object BillingDetails
 * dentro del use case. Aquí solo se descarta un body malformado.
 */
function parseBillingDetails(value: unknown): BillingDetailsPrimitive | null {
  if (typeof value !== 'object' || value === null) return null
  const record = value as Record<string, unknown>
  for (const field of BILLING_FIELDS) {
    if (typeof record[field] !== 'string') return null
  }
  return Object.fromEntries(
    BILLING_FIELDS.map((field) => [field, record[field] as string]),
  ) as unknown as BillingDetailsPrimitive
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
 * El cliente envía plan, asientos extra y datos de facturación; los precios y
 * las líneas de cobro se resuelven SIEMPRE en el servidor (use case) a partir
 * de los `price_...` de entorno: un total manipulado en cliente no afecta.
 *
 * Nota de seguridad: la sesión de KAI vive en localStorage (cliente), así que el
 * servidor no puede derivar el usuario aquí; el island envía `userId` en el
 * body. Es suficiente para la demo en modo test. Para producción conviene
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

  const { planId, period, seats, userId, billingDetails, locale } = body
  if (typeof planId !== 'string' || !planId) {
    return json({ error: 'planId es obligatorio.' }, 400)
  }
  if (!isPeriod(period)) {
    return json({ error: "period debe ser 'monthly' o 'yearly'." }, 400)
  }
  // `seats` son los usuarios EXTRA (0 por defecto); el máximo por plan lo
  // valida el use case contra el dominio.
  const extraSeats = seats === undefined ? 0 : seats
  if (typeof extraSeats !== 'number' || !Number.isInteger(extraSeats) || extraSeats < 0) {
    return json({ error: 'seats debe ser un entero mayor o igual que 0.' }, 400)
  }
  if (typeof userId !== 'string' || !userId) {
    return json({ error: 'Debes iniciar sesión para comprar.' }, 401)
  }
  const parsedBilling = parseBillingDetails(billingDetails)
  if (!parsedBilling) {
    return json({ error: 'billingDetails incompleto o malformado.' }, 400)
  }
  const lang: Locale = isLocale(locale) ? locale : DEFAULT_LOCALE

  const origin = url.origin
  const createCheckout = createCheckoutUseCase(secretKey)

  try {
    const session = await createCheckout.execute({
      planId,
      period,
      extraSeats,
      userId,
      billingDetails: parsedBilling,
      successUrl: `${origin}/${lang}/checkout/gracias?session_id={CHECKOUT_SESSION_ID}`,
      // Cancelar en Stripe devuelve al wizard con el plan y asientos elegidos.
      cancelUrl: `${origin}/${lang}/checkout?plan=${encodeURIComponent(planId)}&seats=${extraSeats}`,
    })
    return json({ url: session.url }, 200)
  } catch (error) {
    if (error instanceof PlanNotFoundError) {
      return json({ error: 'Plan no encontrado.' }, 404)
    }
    if (error instanceof PlanNotPurchasableError) {
      return json({ error: 'Este plan no se puede comprar online.' }, 409)
    }
    if (error instanceof InvalidSeatCountError) {
      return json({ error: 'Número de usuarios no válido para este plan.' }, 400)
    }
    if (error instanceof InvalidBillingDetailsError) {
      return json({ error: 'Datos de facturación no válidos.' }, 400)
    }
    // No filtrar detalles internos de Stripe al cliente; el detalle queda en el log.
    console.error('[checkout] error creando la sesión:', error)
    return json({ error: 'No se pudo iniciar el pago.' }, 502)
  }
}
