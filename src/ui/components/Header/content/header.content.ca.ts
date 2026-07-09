export const headerContent = {
  logoAriaLabel: 'KAI — inici',
  navAriaLabel: 'Principal',
  navMobileAriaLabel: 'Principal mòbil',
  drawerAriaLabel: 'Menú de navegació',
  openMenuLabel: 'Obrir menú',
  closeMenuLabel: 'Tancar menú',
  nav: [
    { to: '/', label: 'Producte', end: true },
    { to: '/planes', label: 'Plans', end: false },
    { to: '/recursos', label: 'Recursos', end: false },
    { to: '/empresa', label: 'Qui som', end: false },
  ],
  actions: {
    loginLabel: 'Iniciar sessió',
    ctaLabel: 'Prova gratuïta',
    accountLabel: 'El meu compte',
  },
  languageSelector: {
    triggerAriaLabel: 'Canviar idioma',
    menuAriaLabel: 'Idiomes disponibles',
  },
} as const
