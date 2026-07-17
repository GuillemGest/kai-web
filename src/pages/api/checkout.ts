import type { APIRoute } from 'astro'
import { createCheckoutUseCase } from '../../modules/billing/application/checkoutFactory'
import {
  InvalidSeatCountError,
  PlanNotFoundError,
  PlanNotPurchasableError,
} from '../../modules/billing/application/CreateCheckoutSession'
import { SubscriptionLimitExceededError } from '../../modules/billing/domain/subscriptionErrors'
import {
  InvalidBillingDetailsError,
  REQUIRED_FIELDS_BY_TYPE,
  type BillingDetailsField,
  type BillingDetailsPrimitive,
  type CustomerType,
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
  organizationId?: unknown
  billingDetails?: unknown
  locale?: unknown
}

const ALL_BILLING_FIELDS: readonly BillingDetailsField[] = [
  'fullName',
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

function isCustomerType(value: unknown): value is CustomerType {
  return value === 'personal' || value === 'company'
}

/**
 * Comprobación de FORMA: exige `customerType` y string en los campos que ese
 * tipo requiere; los no requeridos se ignoran (el cliente no debería enviarlos)
 * y quedan como cadena vacía. La validación de contenido (patrones, mínimos)
 * la hace el value object `BillingDetails` dentro del use case.
 */
function parseBillingDetails(value: unknown): BillingDetailsPrimitive | null {
  if (typeof value !== 'object' || value === null) return null
  const record = value as Record<string, unknown>
  if (!isCustomerType(record.customerType)) return null
  const required = REQUIRED_FIELDS_BY_TYPE[record.customerType]
  for (const field of required) {
    if (typeof record[field] !== 'string') return null
  }
  const primitive: BillingDetailsPrimitive = {
    customerType: record.customerType,
    fullName: '',
    legalName: '',
    taxId: '',
    billingEmail: '',
    addressLine: '',
    city: '',
    postalCode: '',
    province: '',
    country: '',
  }
  for (const field of ALL_BILLING_FIELDS) {
    const raw = record[field]
    if (typeof raw === 'string') primitive[field] = raw
  }
  return primitive
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
 * TODO(billing-multi-org, seguridad): este endpoint NO verifica que el
 * usuario pertenezca a `organizationId` — falta `assertOrganizationAccess`
 * contra el token `Authorization: Bearer`, ver
 * docs/billing-multi-organizacion.md §6 y §7.1 (aquí el riesgo es aún mayor:
 * sin esa verificación, cualquiera puede iniciar un checkout que cargue a la
 * tarjeta de otra organización).
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

  const { planId, period, seats, userId, organizationId, billingDetails, locale } = body
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
  const orgId = typeof organizationId === 'string' ? organizationId.trim() : ''
  if (!orgId) {
    return json({ error: 'organizationId es obligatorio.' }, 400)
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
      organizationId: orgId,
      billingDetails: parsedBilling,
      successUrl: `${origin}/${lang}/checkout/gracias?session_id={CHECKOUT_SESSION_ID}`,
      // Cancelar en Stripe devuelve al wizard con el plan y asientos elegidos.
      cancelUrl: `${origin}/${lang}/checkout?plan=${encodeURIComponent(planId)}&seats=${extraSeats}`,
    })
    return json({ url: session.url }, 200)
  } catch (error) {
    if (error instanceof SubscriptionLimitExceededError) {
      // `code` propio (no solo el mensaje) para que el cliente distinga este
      // caso y ofrezca el enlace a "gestionar mi suscripción" sin parsear texto.
      return json(
        {
          error: 'Ya tienes una suscripción activa. Solo se permite una por cuenta.',
          code: 'SUBSCRIPTION_LIMIT_EXCEEDED',
        },
        409,
      )
    }
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
