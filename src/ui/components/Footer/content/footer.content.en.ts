export const footerContent = {
  tagline: 'The AI assistant to find and export the key moments in your videos.',
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
