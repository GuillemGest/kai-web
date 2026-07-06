export const planTranslations = {
  audioPro: {
    name: 'KAI Audio Pro',
    capacity: '250 GB o 100 h de referencia',
    features: [
      'Procesamiento en cloud (recursos compartidos)',
      'Orientado a modelos centrados en audio',
      '250 GB o 100 h de referencia',
      'Acceso rápido, sin infraestructura dedicada',
    ],
  },
  fullPro: {
    name: 'KAI Full Pro',
    capacity: '250 GB o 100 h de referencia',
    features: [
      'Procesamiento en cloud (recursos compartidos)',
      'Todos los motores: audio, vídeo e IA avanzada',
      '250 GB o 100 h de referencia',
      'Puerta de entrada completa al producto',
    ],
  },
  team: {
    name: 'KAI Team',
    capacity: '1 TB o 1.000 h de referencia',
    features: [
      'Plan cloud con precio por equipo',
      'Recursos cloud dedicados',
      '1 TB o 1.000 h de referencia',
      'Pensado para trabajo colaborativo',
    ],
  },
  enterprise: {
    name: 'KAI 24/7',
    capacity: 'Licencia por producción',
    features: [
      'Licencia enterprise por producción',
      'Posible despliegue on-premise',
      'Seguridad y compliance a medida',
      'Continuidad operativa y soporte ajustado',
    ],
    // Referencias comerciales orientativas del documento oficial (no son tarifa fija).
    references: [
      'Premium Reality Shows: 30.000 € (media ~3 meses)',
      'Small Reality Shows: 9.000 € (media ~1,5 meses)',
    ],
  },
} as const

export type PlanId = keyof typeof planTranslations
