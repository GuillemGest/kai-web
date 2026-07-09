export const headerContent = {
  logoAriaLabel: 'KAI — home',
  navAriaLabel: 'Primary',
  navMobileAriaLabel: 'Primary mobile',
  drawerAriaLabel: 'Navigation menu',
  openMenuLabel: 'Open menu',
  closeMenuLabel: 'Close menu',
  nav: [
    { to: '/', label: 'Product', end: true },
    { to: '/planes', label: 'Plans', end: false },
    { to: '/recursos', label: 'Resources', end: false },
    { to: '/empresa', label: 'About', end: false },
  ],
  actions: {
    loginLabel: 'Sign in',
    ctaLabel: 'Start free trial',
    accountLabel: 'My account',
  },
  languageSelector: {
    triggerAriaLabel: 'Change language',
    menuAriaLabel: 'Available languages',
  },
} as const
