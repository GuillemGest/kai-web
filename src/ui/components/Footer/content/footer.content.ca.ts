export const footerContent = {
  tagline: 'L’assistent d’IA per trobar i exportar els moments clau dels teus vídeos.',
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
