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
      endsAtLabel: 'Ends on',
      pendingChangeLabel: 'Changing to {plan} on {date}',
      changePlanButton: 'Change plan',
      cancelButton: 'Cancel subscription',
      reactivateButton: 'Resume subscription',
      manageButton: 'Manage subscription',
      statusLabels: {
        active: 'Active',
        canceled: 'Canceled',
        past_due: 'Payment pending',
        none: 'No subscription',
      } satisfies Record<Subscription['status'], string>,
      manageDialog: {
        title: 'Manage subscription',
        changeDesc: 'Upgrade or downgrade your plan',
        cancelDesc: 'Stop renewing at the end of this period',
        reactivateDesc: 'Turn automatic renewal back on',
        backLabel: 'Back',
        continueLabel: 'Continue',
        newPlanLabel: 'New plan',
        newPriceLabel: 'New price',
      },
      cancelDialog: {
        title: 'Cancel subscription',
        body: 'Are you sure you want to cancel {plan}? You will keep access until {date}; after that it will not renew and you will lose access. No charge or refund is made now.',
        finalNote: 'This is not final from this step: you can resume the subscription any time before the end date.',
        confirm: 'Yes, cancel',
        cancel: 'No, keep it',
        success: 'Your subscription will be canceled on {date}.',
      },
      reactivateDialog: {
        title: 'Resume subscription',
        body: 'Your {plan} subscription will renew as normal on {date}.',
        finalNote: 'Automatic renewal will resume and the usual amount will be charged on the next renewal date.',
        confirm: 'Resume',
        cancel: 'Close',
        success: 'Your subscription is active again.',
      },
      changeDialog: {
        title: 'Change plan',
        intro: 'Pick the plan you want to switch to. Upgrades apply immediately, charging only this month’s difference; downgrades apply at your next renewal.',
        currentBadge: 'Current plan',
        upgradeNote: 'Upgrade: a Stripe tab will open to confirm the charge for this period’s prorated difference (you can also change your card there). This screen will refresh on its own once you’re done.',
        downgradeNote: 'Downgrade: you keep {plan} until {date}, and the new plan starts at your next renewal.',
        confirm: 'Confirm change',
        confirmUpgrade: 'Continue to pay on Stripe',
        cancel: 'Cancel',
        successNow: 'Plan changed. The new plan is now active.',
        successLater: 'Change scheduled: it will take effect on {date}.',
      },
      genericError: 'The operation could not be completed. Please try again.',
      pricePeriodMonth: '/mo',
    },
    paymentMethod: {
      title: 'Payment method',
      hint: 'The default card is the one used to charge your subscription renewal.',
      empty: 'You have not added a payment method.',
      expiresLabel: 'Expires',
      defaultLabel: 'Default',
      makeDefaultButton: 'Use for charges',
      addCardButton: 'Add card',
      addingCardButton: 'Opening Stripe…',
      removeButton: 'Remove',
      removingButton: 'Removing…',
      removeConfirmTitle: 'Remove card',
      removeConfirmBody: 'You are about to remove the card ending in {last4}. This cannot be undone.',
      removeConfirmButton: 'Remove card',
      removeConfirmCancel: 'Cancel',
      removeBlockedError: 'You cannot remove the default card while you have active subscriptions. Set another card as default first.',
      removeGenericError: 'The card could not be removed. Please try again.',
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
