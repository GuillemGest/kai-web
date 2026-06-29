import type { IPlanRepository } from '../domain/IPlanRepository'
import { Plan, type PlanPrimitive } from '../domain/Plan'

const PLANS: PlanPrimitive[] = [
  {
    id: 'starter',
    name: 'Starter',
    priceMonth: 9,
    currency: 'EUR',
    features: ['1 proyecto activo', 'Exportación estándar', 'Hasta 2h de vídeo / mes', 'Soporte por email'],
    stripePriceId: null,
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    priceMonth: 29,
    currency: 'EUR',
    features: [
      'Proyectos ilimitados',
      'Exportación en alta calidad',
      'Hasta 20h de vídeo / mes',
      'Editor de clips avanzado',
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
      'Todo lo de Pro',
      'Vídeo ilimitado',
      'Colaboración en equipo',
      'Integraciones y API',
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
