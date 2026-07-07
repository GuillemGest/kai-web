export const footerContent = {
  tagline: 'The AI assistant that finds the key moments in your videos and sends them to your editor.',
  legalTemplate: '© {year} KAI · Gestmusic — Amplify',
  columns: [
    {
      title: 'Product',
      links: [
        { to: '/', label: 'Product' },
        { to: '/planes', label: 'Plans' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { to: '/recursos', label: 'Resources' },
        { to: '/cuenta', label: 'My account' },
      ],
    },
    {
      title: 'Company',
      links: [{ to: '/empresa', label: 'About KAI' }],
    },
  ],
} as const
