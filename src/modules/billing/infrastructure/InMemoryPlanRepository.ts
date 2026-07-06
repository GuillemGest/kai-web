import type { IPlanRepository } from '../domain/IPlanRepository'
import { Plan, type PlanPrimitive } from '../domain/Plan'

/**
 * Planes oficiales de KAI según el Market and Product Plan (pricing model v1).
 *
 * Estructura por capas:
 *  - KAI Pro/Solo → dos variantes cloud de entrada (Audio Pro / Full Pro).
 *  - KAI Team     → plan cloud por equipo, recursos dedicados.
 *  - KAI 24/7     → licencia enterprise por producción, cotización a medida.
 *
 * Nota: `name`, `features` y `capacity` se localizan en `ShopPage` vía
 * `plans.content.*`. Aquí se define lo estructural (precio, custom, highlighted).
 */
const PLANS: PlanPrimitive[] = [
  {
    id: 'audioPro',
    name: 'KAI Audio Pro',
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
    stripePriceId: null,
    highlighted: false,
  },
  {
    id: 'fullPro',
    name: 'KAI Full Pro',
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
    stripePriceId: null,
    highlighted: true,
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
    stripePriceId: null,
    highlighted: false,
  },
  {
    id: 'enterprise',
    name: 'KAI 24/7',
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
    stripePriceId: null,
    highlighted: false,
  },
]

export class InMemoryPlanRepository implements IPlanRepository {
  async getAll(): Promise<Plan[]> {
    return PLANS.map(Plan.fromPrimitive)
  }
}
