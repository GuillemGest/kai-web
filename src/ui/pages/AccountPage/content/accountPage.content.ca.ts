import type { Subscription } from '../../../../modules/billing/domain/Subscription'

/**
 * Traducció al català (ca) del contingut d’AccountPage.
 */
export const accountPageContent = {
  locale: 'ca-ES',

  title: 'El meu compte',
  notLoggedIn: 'No has iniciat sessió.',

  profile: {
    title: 'Perfil',
    nameLabel: 'Nom',
    emailLabel: 'Correu electrònic',
  },

  subscription: {
    title: 'Subscripció',
    empty: 'No tens cap subscripció activa.',
    statusLabel: 'Estat',
    planLabel: 'Pla',
    renewsAtLabel: 'Es renova el',
    manageButton: 'Gestionar pagament',
    statusLabels: {
      active: 'Activa',
      canceled: 'Cancel·lada',
      past_due: 'Pagament pendent',
      none: 'Sense subscripció',
    } satisfies Record<Subscription['status'], string>,
  },
} as const
