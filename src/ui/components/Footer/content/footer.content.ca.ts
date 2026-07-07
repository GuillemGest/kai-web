export const footerContent = {
  tagline: 'L’assistent d’IA que troba els moments clau dels teus vídeos i els envia al teu editor.',
  legalTemplate: '© {year} KAI · Gestmusic — Amplify',
  columns: [
    {
      title: 'Producte',
      links: [
        { to: '/', label: 'Producte' },
        { to: '/planes', label: 'Plans' },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { to: '/recursos', label: 'Recursos' },
        { to: '/cuenta', label: 'El meu compte' },
      ],
    },
    {
      title: 'Companyia',
      links: [{ to: '/empresa', label: 'Sobre KAI' }],
    },
  ],
} as const
