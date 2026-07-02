export const planTranslations = {
  starter: {
    name: 'Individual',
    features: [
      '1 proyecto activo',
      '2 h/mes de vídeo incluidas',
      'Búsqueda en lenguaje natural',
      'Exportación estándar',
      'Soporte por email',
    ],
  },
  pro: {
    name: 'Pro',
    features: [
      'Funciones del plan Individual',
      'Proyectos ilimitados',
      '20 h/mes de vídeo incluidas',
      'Organización de clips',
      'Exportación avanzada',
      'Soporte prioritario',
    ],
  },
  studio: {
    name: 'Studio',
    features: [
      'Funciones del plan Pro',
      'Volumen de vídeo ampliado',
      'Trabajo en equipo',
      'Integraciones según proyecto',
      'Soporte dedicado',
    ],
  },
} as const

export type PlanId = keyof typeof planTranslations
