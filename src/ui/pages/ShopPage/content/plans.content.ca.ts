export const planTranslations = {
  audioPro: {
    name: 'KAI Audio Pro',
    capacity: '250 GB o 100 h de referència',
    features: [
      'Processament al cloud (recursos compartits)',
      'Orientat a models centrats en àudio',
      '250 GB o 100 h de referència',
      'Accés ràpid, sense infraestructura dedicada',
    ],
  },
  fullPro: {
    name: 'KAI Full Pro',
    capacity: '250 GB o 100 h de referència',
    features: [
      'Processament al cloud (recursos compartits)',
      'Tots els motors: àudio, vídeo i IA avançada',
      '250 GB o 100 h de referència',
      'Porta d’entrada completa al producte',
    ],
  },
  team: {
    name: 'KAI Team',
    capacity: '1 TB o 1.000 h de referència',
    features: [
      'Pla cloud amb preu per equip',
      'Recursos cloud dedicats',
      '1 TB o 1.000 h de referència',
      'Pensat per al treball col·laboratiu',
    ],
  },
  enterprise: {
    name: 'KAI 24/7',
    capacity: 'Llicència per producció',
    features: [
      'Llicència enterprise per producció',
      'Possible desplegament on-premise',
      'Seguretat i compliance a mida',
      'Continuïtat operativa i suport ajustat',
    ],
    // Referències comercials orientatives del document oficial (no és tarifa fixa).
    references: [
      'Premium Reality Shows: 30.000 € (mitjana ~3 mesos)',
      'Small Reality Shows: 9.000 € (mitjana ~1,5 mesos)',
    ],
  },
} as const
