import type { IPlanRepository } from '../domain/IPlanRepository'
import { Plan, type PlanPrimitive } from '../domain/Plan'

/**
 * Los `price_...` de Stripe se leen de variables de entorno del servidor para
 * no hardcodear IDs de infraestructura en el repositorio. En cliente estas
 * variables son `undefined` (import.meta.env solo expone las `PUBLIC_*`), pero
 * el checkout se resuelve siempre en el endpoint SSR, donde sí están disponibles.
 * Configúralas en `.env` con los IDs que genere tu dashboard de Stripe (test).
 */
const env = import.meta.env
function stripePrice(key: string): string | null {
  const value = env[key]
  return typeof value === 'string' && value.length > 0 ? value : null
}

/**
 * Planes oficiales de KAI según el Market and Product Plan (pricing model v1).
 *
 * Estructura por capas:
 *  - Cloud de entrada  → dos variantes (KAI Audio Analysis / KAI Full).
 *  - KAI Team          → plan cloud por equipo, recursos dedicados.
 *  - KAI Enterprise    → licencia enterprise por producción, cotización a medida.
 *
 * Nota: `name`, `features` y `capacity` se localizan en `ShopPage` vía
 * `plans.content.*`. Aquí se define lo estructural (precio, custom, highlighted).
 */
const PLANS: PlanPrimitive[] = [
  {
    id: 'free',
    name: 'KAI Free',
    priceMonth: 0,
    currency: 'EUR',
    capacity: '2 GB o 1 h',
    custom: false,
    features: [
      'Cloud con recursos compartidos',
      'Sin motor de audio',
      '2 GB o 1 h de referencia',
      'Sin subida de vídeo',
      'Sin exportación al editor',
    ],
    // Plan gratuito: no se cobra vía Stripe.
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    highlighted: false,
  },
  {
    id: 'audioPro',
    name: 'KAI Audio Analysis',
    priceMonth: 59,
    currency: 'EUR',
    capacity: '250 GB o 100 h',
    custom: false,
    features: [
      'Cloud con recursos compartidos',
      'Motor de audio',
      '250 GB o 100 h de referencia',
      'Ideal para modelos centrados en audio',
    ],
    stripePriceIdMonthly: stripePrice('STRIPE_PRICE_AUDIOPRO_MONTHLY'),
    stripePriceIdYearly: stripePrice('STRIPE_PRICE_AUDIOPRO_YEARLY'),
    highlighted: false,
  },
  {
    id: 'fullPro',
    name: 'KAI Full',
    priceMonth: 149,
    currency: 'EUR',
    capacity: '250 GB o 100 h',
    custom: false,
    features: [
      'Cloud con recursos compartidos',
      'Todos los motores: audio, vídeo e IA avanzada',
      '250 GB o 100 h de referencia',
      'Puerta de entrada completa al producto',
    ],
    stripePriceIdMonthly: stripePrice('STRIPE_PRICE_FULLPRO_MONTHLY'),
    stripePriceIdYearly: stripePrice('STRIPE_PRICE_FULLPRO_YEARLY'),
    highlighted: false,
  },
  {
    id: 'team',
    name: 'KAI Team',
    priceMonth: 299,
    currency: 'EUR',
    capacity: '1 TB o 1.000 h',
    custom: false,
    features: [
      'Plan cloud con precio por equipo',
      'Recursos cloud dedicados',
      '1 TB o 1.000 h de referencia',
      'Pensado para trabajo colaborativo',
    ],
    stripePriceIdMonthly: stripePrice('STRIPE_PRICE_TEAM_MONTHLY'),
    stripePriceIdYearly: stripePrice('STRIPE_PRICE_TEAM_YEARLY'),
    highlighted: false,
  },
  {
    id: 'enterprise',
    name: 'KAI Enterprise',
    priceMonth: null,
    currency: 'EUR',
    capacity: null,
    custom: true,
    features: [
      'Licencia enterprise por producción',
      'Posible despliegue on-premise',
      'Seguridad y compliance a medida',
      'Continuidad operativa y soporte ajustado',
    ],
    // Plan a medida: cotización por producción, sin checkout de Stripe.
    stripePriceIdMonthly: null,
    stripePriceIdYearly: null,
    highlighted: false,
  },
]

export class InMemoryPlanRepository implements IPlanRepository {
  async getAll(): Promise<Plan[]> {
    return PLANS.map(Plan.fromPrimitive)
  }
}
