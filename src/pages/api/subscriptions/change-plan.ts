import type { APIRoute } from 'astro'
import { createChangeSubscriptionPlanUseCase } from '../../../modules/billing/application/subscriptionFactory'
import {
  SamePlanError,
  SeatLimitExceededError,
  SubscriptionNotFoundError,
  SubscriptionNotManageableError,
} from '../../../modules/billing/domain/subscriptionErrors'
import {
  PlanNotFoundError,
  PlanNotPurchasableError,
} from '../../../modules/billing/application/CreateCheckoutSession'
import type { BillingPeriod } from '../../../modules/billing/domain/Plan'

// Endpoint SSR: se ejecuta en el servidor, no se prerenderiza.
export const prerender = false

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
 * Cambia el plan de una suscripción. El TIMING (upgrade prorrateado ya vs.
 * downgrade a fin de periodo) lo decide SIEMPRE el use case en el servidor a
 * partir de los precios reales: el cliente solo dice a qué plan quiere ir.
 *
 * Devuelve `timing` (para que la UI informe de cuándo entra en vigor) y
 * `paymentUrl`: en upgrades con importe pendiente, la página de factura
 * alojada de Stripe donde el usuario confirma el cargo (o cambia de tarjeta);
 * `null` si no aplica. El cliente debe redirigir a esa URL si viene informada
 * — el cambio de plan no se da por completado hasta que esa factura se paga.
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

  let body: {
    organizationId?: unknown
    subscriptionId?: unknown
    planId?: unknown
    period?: unknown
  }
  try {
    body = (await request.json()) as typeof body
  } catch {
    return json({ error: 'Body inválido.' }, 400)
  }

  const organizationId = typeof body.organizationId === 'string' ? body.organizationId.trim() : ''
  const subscriptionId = typeof body.subscriptionId === 'string' ? body.subscriptionId.trim() : ''
  const planId = typeof body.planId === 'string' ? body.planId.trim() : ''
  if (!organizationId) {
    return json({ error: 'organizationId es obligatorio.' }, 400)
  }
  if (!subscriptionId) {
    return json({ error: 'subscriptionId es obligatorio.' }, 400)
  }
  if (!planId) {
    return json({ error: 'planId es obligatorio.' }, 400)
  }
  if (!isPeriod(body.period)) {
    return json({ error: "period debe ser 'monthly' o 'yearly'." }, 400)
  }

  try {
    const { timing, paymentUrl } = await createChangeSubscriptionPlanUseCase(secretKey).execute({
      organizationId,
      subscriptionId,
      planId,
      period: body.period,
    })
    return json({ ok: true, timing, paymentUrl }, 200)
  } catch (error) {
    if (error instanceof SubscriptionNotFoundError) {
      return json({ error: 'Suscripción no encontrada.' }, 404)
    }
    if (error instanceof SubscriptionNotManageableError) {
      return json({ error: 'Esta suscripción no se puede modificar.' }, 409)
    }
    if (error instanceof SamePlanError) {
      return json({ error: 'La suscripción ya está en ese plan.' }, 409)
    }
    if (error instanceof SeatLimitExceededError) {
      return json({ error: 'El plan elegido no admite los usuarios adicionales contratados.' }, 409)
    }
    if (error instanceof PlanNotFoundError) {
      return json({ error: 'Plan no encontrado.' }, 404)
    }
    if (error instanceof PlanNotPurchasableError) {
      return json({ error: 'Este plan no se puede contratar online.' }, 409)
    }
    console.error('[subscriptions/change-plan] error cambiando de plan:', error)
    return json({ error: 'No se pudo cambiar de plan.' }, 502)
  }
}
