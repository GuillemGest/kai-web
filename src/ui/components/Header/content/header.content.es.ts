export const headerContent = {
  logoAriaLabel: 'KAI — inicio',
  navAriaLabel: 'Principal',
  navMobileAriaLabel: 'Principal móvil',
  drawerAriaLabel: 'Menú de navegación',
  openMenuLabel: 'Abrir menú',
  closeMenuLabel: 'Cerrar menú',
  nav: [
    { to: '/', label: 'Producto', end: true },
    { to: '/planes', label: 'Planes', end: false },
    { to: '/recursos', label: 'Recursos', end: false },
    { to: '/empresa', label: 'Quiénes somos', end: false },
  ],
  actions: {
    loginLabel: 'Iniciar sesión',
    ctaLabel: 'Prueba gratis',
  },
  languageSelector: {
    triggerAriaLabel: 'Cambiar idioma',
    menuAriaLabel: 'Idiomas disponibles',
  },
} as const
