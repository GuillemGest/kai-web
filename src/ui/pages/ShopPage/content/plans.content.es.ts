export const planTranslations = {
  free: {
    name: 'KAI Free',
    capacity: '2 GB o 1 h de referencia',
    features: [
      'Procesamiento en cloud sobre recursos compartidos',
      'Sin motor de audio',
      '2 GB o 1 h de referencia',
      'Sin subida de vídeo',
      'Sin exportación al editor',
    ],
  },
  audioPro: {
    name: 'KAI Audio Analysis',
    capacity: '250 GB o 100 h de referencia',
    features: [
      'Procesamiento en cloud sobre recursos compartidos',
      'Montado sobre modelos centrados en audio',
      '250 GB o 100 h de referencia',
      'En marcha enseguida, sin infraestructura que montar',
    ],
  },
  fullPro: {
    name: 'KAI Full',
    capacity: '250 GB o 100 h de referencia',
    features: [
      'Procesamiento en cloud sobre recursos compartidos',
      'Todos los motores: audio, vídeo e IA avanzada',
      '250 GB o 100 h de referencia',
      'El producto completo desde el primer día',
    ],
  },
  team: {
    name: 'KAI Team',
    capacity: '1 TB o 1.000 h de referencia',
    features: [
      'Plan cloud con precio por equipo',
      'Recursos cloud dedicados',
      '1 TB o 1.000 h de referencia',
      'Hecho para trabajar en equipo',
    ],
  },
  enterprise: {
    name: 'KAI Enterprise',
    capacity: 'Licencia por producción',
    features: [
      'Licencia enterprise, una por producción',
      'Despliegue on-premise si lo necesitas',
      'Seguridad y compliance hechos a tu medida',
      'Operación estable y soporte a la medida del trabajo',
    ],
  },
} as const

export type PlanId = keyof typeof planTranslations
