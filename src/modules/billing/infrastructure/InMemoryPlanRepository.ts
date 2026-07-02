import type { IPlanRepository } from '../domain/IPlanRepository'
import { Plan, type PlanPrimitive } from '../domain/Plan'

const PLANS: PlanPrimitive[] = [
  {
    id: 'starter',
    name: 'Individual',
    priceMonth: 9,
    currency: 'EUR',
    features: [
      '1 proyecto activo',
      '2 h/mes de vídeo incluidas',
      'Búsqueda en lenguaje natural',
      'Exportación estándar',
      'Soporte por email',
    ],
    stripePriceId: null,
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonth: 29,
    currency: 'EUR',
    features: [
      'Funciones del plan Individual',
      'Proyectos ilimitados',
      '20 h/mes de vídeo incluidas',
      'Organización de clips',
      'Exportación avanzada',
      'Soporte prioritario',
    ],
    stripePriceId: null,
    highlighted: true,
  },
  {
    id: 'studio',
    name: 'Studio',
    priceMonth: 79,
    currency: 'EUR',
    features: [
      'Funciones del plan Pro',
      'Volumen de vídeo ampliado',
      'Trabajo en equipo',
      'Integraciones según proyecto',
      'Soporte dedicado',
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
