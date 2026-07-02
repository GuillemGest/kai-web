import type { Subscription } from '../../../../modules/billing/domain/Subscription'

/**
 * English (en) translation of AccountPage content.
 */
export const accountPageContent = {
  locale: 'en-GB',

  title: 'My account',
  notLoggedIn: 'You are not signed in.',

  profile: {
    title: 'Profile',
    nameLabel: 'Name',
    emailLabel: 'Email',
  },

  subscription: {
    title: 'Subscription',
    empty: 'You do not have an active subscription.',
    statusLabel: 'Status',
    planLabel: 'Plan',
    renewsAtLabel: 'Renews on',
    manageButton: 'Manage payment',
    statusLabels: {
      active: 'Active',
      canceled: 'Canceled',
      past_due: 'Payment pending',
      none: 'No subscription',
    } satisfies Record<Subscription['status'], string>,
  },
} as const
