export const footerContent = {
  tagline: 'El asistente de IA para encontrar y exportar los momentos clave de tus vídeos.',
  legalTemplate: '© {year} KAI · Gestmusic — Amplify',
  columns: [
    {
      title: 'Producto',
      links: [
        { to: '/', label: 'Producto' },
        { to: '/planes', label: 'Planes' },
      ],
    },
    {
      title: 'Recursos',
      links: [
        { to: '/recursos', label: 'Recursos' },
        { to: '/cuenta', label: 'Mi cuenta' },
      ],
    },
    {
      title: 'Compañía',
      links: [{ to: '/empresa', label: 'Sobre KAI' }],
    },
  ],
} as const
