export const planTranslations = {
  free: {
    name: 'KAI Free',
    capacity: '2 GB or 1 h reference',
    features: [
      'Cloud processing on shared resources',
      'No audio engine',
      '2 GB or 1 h reference',
      'No video uploads',
      'No export to the editor',
    ],
  },
  audioPro: {
    name: 'KAI Audio Analysis',
    capacity: '250 GB or 100 h reference',
    features: [
      'Cloud processing on shared resources',
      'Built around audio-focused models',
      '250 GB or 100 h reference',
      'Up and running fast, no infrastructure to set up',
    ],
  },
  fullPro: {
    name: 'KAI Full',
    capacity: '250 GB or 100 h reference',
    features: [
      'Cloud processing on shared resources',
      'Every engine: audio, video and advanced AI',
      '250 GB or 100 h reference',
      'The full product, right from the start',
    ],
  },
  team: {
    name: 'KAI Team',
    capacity: '1 TB or 1,000 h reference',
    features: [
      'Cloud plan priced per team',
      'Dedicated cloud resources',
      '1 TB or 1,000 h reference',
      'Made for working together',
    ],
  },
  enterprise: {
    name: 'KAI Enterprise',
    capacity: 'Per-production licence',
    features: [
      'Enterprise licence, one per production',
      'On-premise deployment if you need it',
      'Security and compliance shaped around you',
      'Steady operation and support tuned to the job',
    ],
  },
} as const
