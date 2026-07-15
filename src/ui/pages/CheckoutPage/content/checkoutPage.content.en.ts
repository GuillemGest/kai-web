/** English copy for the checkout wizard. Mirror of checkoutPage.content.es.ts. */
export const checkoutPageContent = {
  heading: 'Complete your purchase',
  subheading: 'Three steps: pick your plan, tell us who we invoice and pay securely.',

  steps: {
    plan: 'Plan',
    billing: 'Purchase details',
    payment: 'Payment',
  },

  loading: 'Loading plans…',
  error: {
    message: 'Plans could not be loaded. Please try again.',
    retry: 'Retry',
  },

  plan: {
    title: 'Your plan',
    subtitle: 'You can switch plans and add users before paying.',
    pricePeriodMonth: '/mo',
    includedUserNote: '1 user included',
    extraSeatsLabel: 'Additional users',
    extraSeatsHint: 'Each additional user adds €{price}/month.',
    extraSeatsMax: 'Up to {max} additional users on this plan.',
    extraSeatsNone: 'This plan is individual: it does not allow additional users.',
    seatsDecreaseAria: 'Remove one additional user',
    seatsIncreaseAria: 'Add one additional user',
    summaryBaseLabel: '{name} plan',
    summarySeatsLabel: '{count} × additional user',
    totalLabel: 'Total',
    continue: 'Continue',
  },

  billing: {
    title: 'Purchase details',
    subtitle: 'We need them to issue your invoice. All fields are required.',
    // ⚠️ PROVISIONAL: dev-only button to autofill the form while testing.
    devFillButton: 'Fill with test data',
    fields: {
      legalName: {
        label: 'Legal name',
        placeholder: 'Company or freelancer legal name',
        error: 'Enter the legal name (at least 3 characters).',
      },
      taxId: {
        label: 'Tax ID (NIF/CIF/VAT)',
        placeholder: 'B12345678',
        error: 'Enter a valid tax ID.',
      },
      billingEmail: {
        label: 'Billing email',
        placeholder: 'invoices@yourcompany.com',
        error: 'Enter a valid email.',
        hint: 'This is your account email and cannot be changed.',
      },
      addressLine: {
        label: 'Address',
        placeholder: 'Street and number',
        error: 'Enter the billing address.',
      },
      city: {
        label: 'City',
        placeholder: 'Barcelona',
        error: 'Enter the city.',
      },
      postalCode: {
        label: 'Postal code',
        placeholder: '08001',
        error: 'Enter a valid postal code.',
      },
      province: {
        label: 'State / Province',
        placeholder: 'Barcelona',
        error: 'Enter the state or province.',
      },
      country: {
        label: 'Country',
        error: 'Select a country.',
      },
    },
    countryOptions: [
      { code: 'ES', label: 'Spain' },
      { code: 'AD', label: 'Andorra' },
      { code: 'PT', label: 'Portugal' },
      { code: 'FR', label: 'France' },
      { code: 'IT', label: 'Italy' },
      { code: 'DE', label: 'Germany' },
      { code: 'GB', label: 'United Kingdom' },
      { code: 'US', label: 'United States' },
      { code: 'MX', label: 'Mexico' },
      { code: 'AR', label: 'Argentina' },
    ],
    back: 'Back',
    continue: 'Continue',
  },

  payment: {
    title: 'Review and pay',
    subtitle: 'Check the summary before continuing to secure payment.',
    planLabel: 'Plan',
    usersLabel: 'Users',
    usersValue: '{count} in total (1 included + {extra} additional)',
    usersValueSingle: '1 user included',
    seatsLine: '{count} × additional user (€{price}/month each)',
    billingTitle: 'Invoice to',
    totalLabel: 'Total',
    pricePeriodMonth: '/mo',
    payIdle: 'Pay with Stripe',
    payLoading: 'Redirecting to Stripe…',
    secureNote: 'Secure payment handled by Stripe. We never store your card.',
    errorGeneric: 'The payment could not be started. Please try again.',
    back: 'Back',
  },
} as const
