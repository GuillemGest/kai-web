export const planTranslations = {
  audioPro: {
    name: 'KAI Audio Pro',
    capacity: '250 GB or 100 h reference',
    features: [
      'Cloud processing (shared resources)',
      'Geared to audio-focused models',
      '250 GB or 100 h reference',
      'Fast access, no dedicated infrastructure',
    ],
  },
  fullPro: {
    name: 'KAI Full Pro',
    capacity: '250 GB or 100 h reference',
    features: [
      'Cloud processing (shared resources)',
      'All engines: audio, video and advanced AI',
      '250 GB or 100 h reference',
      'Full entry point to the product',
    ],
  },
  team: {
    name: 'KAI Team',
    capacity: '1 TB or 1,000 h reference',
    features: [
      'Cloud plan with per-team pricing',
      'Dedicated cloud resources',
      '1 TB or 1,000 h reference',
      'Built for collaborative work',
    ],
  },
  enterprise: {
    name: 'KAI 24/7',
    capacity: 'Per-production licence',
    features: [
      'Enterprise licence per production',
      'On-premise deployment available',
      'Security and compliance tailored to you',
      'Operational continuity and adjusted support',
    ],
    // Indicative commercial references from the official document (not a fixed rate).
    references: [
      'Premium Reality Shows: €30,000 (avg ~3 months)',
      'Small Reality Shows: €9,000 (avg ~1.5 months)',
    ],
  },
} as const
