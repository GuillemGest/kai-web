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
    accountLabel: 'Mi cuenta',
    accountsMenu: {
      triggerAriaLabel: 'Abrir menú de cuenta',
      menuAriaLabel: 'Cuentas guardadas',
      activeBadge: 'Cuenta activa',
      noOrg: 'Sin organización seleccionada',
      switchToAria: 'Cambiar a {name}',
      removeAccountAria: 'Eliminar cuenta guardada {name}',
      addNew: 'Añadir cuenta nueva',
      switchErrorLabel: 'No se pudo cambiar de cuenta. Inténtalo de nuevo.',
      settingsLabel: 'Ajustes de la cuenta',
    },
  },
  languageSelector: {
    triggerAriaLabel: 'Cambiar idioma',
    menuAriaLabel: 'Idiomas disponibles',
  },
} as const
