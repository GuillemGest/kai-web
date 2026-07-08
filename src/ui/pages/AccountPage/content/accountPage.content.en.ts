import type { Subscription } from '../../../../modules/billing/domain/Subscription'
import type { InvoiceStatus } from '../../../../modules/billing/domain/Invoice'
import type { TeamRole, MemberStatus } from '../../../../modules/team/domain/TeamMember'

/**
 * English (en) translation of the "My account" panel content.
 */
export const accountPageContent = {
  locale: 'en-GB',

  title: 'My account',
  subtitle: 'Manage your profile, subscription, team and security.',
  notLoggedIn: 'You are not signed in yet.',

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
        refunded: 'Refunded',
      } satisfies Record<InvoiceStatus, string>,
    },
  },

  team: {
    title: 'Team administration',
    description: 'Members of your organisation and the seats in your plan.',
    seatsUsed: 'seats in use',
    seatsOf: 'of',
    inviteButton: 'Invite someone',
    memberColumn: 'Member',
    roleColumn: 'Role',
    statusColumn: 'Status',
    joinedColumn: 'Since',
    manageAria: 'Manage {name}',
    roleLabels: {
      owner: 'Owner',
      admin: 'Admin',
      editor: 'Editor',
    } satisfies Record<TeamRole, string>,
    statusLabels: {
      active: 'Active',
      invited: 'Invitation pending',
    } satisfies Record<MemberStatus, string>,
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
