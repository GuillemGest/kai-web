import type { Subscription } from '../../../../modules/billing/domain/Subscription'
import type { InvoiceStatus } from '../../../../modules/billing/domain/Invoice'

/**
 * English (en) translation of the "My account" panel content.
 */
export const accountPageContent = {
  locale: 'en-GB',

  title: 'My account',
  subtitle: 'Manage your profile, subscription, team and security.',
  notLoggedIn: 'You are not signed in yet.',
  logoutButton: 'Sign out',

  /**
   * Free-trial-started notice. Shown when reaching the account with
   * ?trial=started (after signing in from the "Free trial" chip on plans).
   * Appearance only: no trial state is persisted for now.
   */
  trialBanner: {
    title: 'Your free trial has started',
    text: 'You have 15 days to try KAI at no cost. Download the plugin and start finding your best moments.',
    dismissLabel: 'Dismiss notice',
  },

  nav: {
    account: 'Account',
    billing: 'Billing',
    team: 'Administration',
    security: 'Security',
  },

  account: {
    title: 'Account information',
    description: 'The details we use to identify your KAI account.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    memberSinceLabel: 'Member since',
    languageLabel: 'Preferred language',
    editButton: 'Edit profile',
    changePasswordButton: 'Change password',
  },

  billing: {
    title: 'Billing',
    description: 'Your current plan, payment method and invoices.',
    plan: {
      title: 'Current plan',
      empty: 'You do not have an active subscription.',
      statusLabel: 'Status',
      planLabel: 'Plan',
      renewsAtLabel: 'Renews on',
      canceledAtLabel: 'Ends on',
      changePlanButton: 'Change plan',
      statusLabels: {
        active: 'Active',
        canceled: 'Canceled',
        past_due: 'Payment pending',
        none: 'No subscription',
      } satisfies Record<Subscription['status'], string>,
    },
    paymentMethod: {
      title: 'Payment method',
      empty: 'You have not added a payment method.',
      expiresLabel: 'Expires',
      updateButton: 'Update card',
    },
    invoices: {
      title: 'Invoice history',
      empty: 'No invoices yet.',
      numberLabel: 'Invoice',
      dateLabel: 'Date',
      amountLabel: 'Amount',
      statusLabel: 'Status',
      downloadLabel: 'Download PDF',
      downloadAriaLabel: 'Download invoice {number} as PDF',
      statusLabels: {
        paid: 'Paid',
        open: 'Pending',
        void: 'Voided',
        uncollectible: 'Uncollectible',
        refunded: 'Refunded',
      } satisfies Record<InvoiceStatus, string>,
    },
  },

  team: {
    title: 'User administration',
    description: 'Users of each organisation on the platform.',
    inviteButton: 'Invite someone',
    organizationLabel: 'Organisation',
    usersInOrg: 'users in this organisation',
    emptyUsers: 'No users to show.',
    fullAdminLabel: 'Admin',
  },

  security: {
    title: 'Security & sessions',
    description: 'Review where you are signed in and keep your account safe.',
    password: {
      title: 'Password',
      hint: 'Last updated more than 3 months ago.',
      changeButton: 'Change password',
    },
    sessions: {
      title: 'Active sessions',
      empty: 'No other sessions are open.',
      currentLabel: 'This session',
      lastActiveLabel: 'Last active',
      revokeLabel: 'Sign out',
      revokeAriaLabel: 'Sign out of {device}',
      revokeAllButton: 'Sign out of all other sessions',
    },
  },
} as const
