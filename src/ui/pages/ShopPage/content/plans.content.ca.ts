export const planTranslations = {
  free: {
    name: 'KAI Free',
    capacity: '2 GB o 1 h de referència',
    features: [
      'Processament al cloud sobre recursos compartits',
      'Sense motor d’àudio',
      '2 GB o 1 h de referència',
      'Sense pujada de vídeo',
      'Sense exportació a l’editor',
    ],
  },
  audioPro: {
    name: 'KAI Audio Analysis',
    capacity: '250 GB o 100 h de referència',
    features: [
      'Processament al cloud sobre recursos compartits',
      'Muntat sobre models centrats en àudio',
      '250 GB o 100 h de referència',
      'En marxa de seguida, sense infraestructura per muntar',
    ],
  },
  fullPro: {
    name: 'KAI Full',
    capacity: '250 GB o 100 h de referència',
    features: [
      'Processament al cloud sobre recursos compartits',
      'Tots els motors: àudio, vídeo i IA avançada',
      '250 GB o 100 h de referència',
      'El producte complet des del primer dia',
    ],
  },
  team: {
    name: 'KAI Team',
    capacity: '1 TB o 1.000 h de referència',
    features: [
      'Pla cloud amb preu per equip',
      'Recursos cloud dedicats',
      '1 TB o 1.000 h de referència',
      'Fet per treballar en equip',
    ],
  },
  enterprise: {
    name: 'KAI Enterprise',
    capacity: 'Llicència per producció',
    features: [
      'Llicència enterprise, una per producció',
      'Desplegament on-premise si el necessites',
      'Seguretat i compliance fets a la teva mida',
      'Operació estable i suport a la mida de la feina',
    ],
  },
} as const
