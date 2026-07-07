export const footerContent = {
  tagline: 'El asistente de IA que encuentra los momentos clave de tus vídeos y los manda a tu editor.',
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
