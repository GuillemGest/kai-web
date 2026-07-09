import type { APIRoute } from 'astro'
import Stripe from 'stripe'

// Endpoint SSR: se ejecuta en el servidor, no se prerenderiza.
export const prerender = false

/**
 * Webhook de Stripe: fuente de verdad del estado de pago.
 *
 * NUNCA activar una suscripción solo con el `success_url`: el usuario puede
 * cerrar el navegador o falsear la vuelta. Es este webhook, con firma verificada,
 * quien confirma que el cobro ocurrió.
 *
 * Requiere leer el body EN CRUDO (`request.text()`) para verificar la firma;
 * si se parsea antes, la verificación falla.
 */
export const POST: APIRoute = async ({ request }) => {
  const secretKey = import.meta.env.STRIPE_SECRET_KEY
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET
  if (!secretKey || !webhookSecret) {
    return new Response('Stripe no está configurado.', { status: 500 })
  }

  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return new Response('Falta la firma de Stripe.', { status: 400 })
  }

  const stripe = new Stripe(secretKey)
  const payload = await request.text()

  let event: Stripe.Event
  try {
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret)
  } catch (error) {
    // Firma inválida: posible intento de suplantación. No procesar.
    console.error('[webhook] firma inválida:', error)
    return new Response('Firma inválida.', { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const userId = session.client_reference_id ?? session.metadata?.userId ?? null
      // DEMO: aquí es donde, en producción, se crearía/activaría la Subscription
      // del usuario vía ISubscriptionRepository (backend Amplify). De momento solo
      // se registra para verificar que el flujo end-to-end llega hasta aquí.
      console.info(
        `[webhook] checkout completado — userId=${userId}, subscription=${session.subscription}`,
      )
      break
    }
    case 'customer.subscription.deleted':
    case 'customer.subscription.updated': {
      // DEMO: cambios de estado (cancelación, impago...) se reflejarían aquí.
      const subscription = event.data.object
      console.info(`[webhook] suscripción ${event.type} — id=${subscription.id}`)
      break
    }
    default:
      // Eventos no manejados: responder 200 para que Stripe no reintente.
      break
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}
