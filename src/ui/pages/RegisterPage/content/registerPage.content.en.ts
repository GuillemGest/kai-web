/**
 * English (en) translation of RegisterPage content.
 */
export const registerPageContent = {
  brand: {
    quoteLead: 'Create your account and start ',
    quoteEmphasis: 'saving hours',
    quoteTail: ' of footage review.',
    quoteMeta:
      'Your billing details let us activate your subscription and issue your invoices correctly from day one.',
  },

  form: {
    heading: 'Create account',
    subheading: 'Fill in your details to get started with KAI.',
    loginPrompt: 'Already have an account?',
    loginLink: 'Sign in',

    sectionContact: 'Contact details',
    sectionBilling: 'Billing address',

    firstNameLabel: 'First name',
    firstNamePlaceholder: 'Ana',
    lastNameLabel: 'Last name',
    lastNamePlaceholder: 'García',
    companyLabel: 'Company',
    companyOptional: '(optional)',
    companyPlaceholder: 'Your company name',
    emailLabel: 'Email',
    emailPlaceholder: 'you@email.com',
    phoneLabel: 'Phone',
    phonePlaceholder: '+1 555 000 0000',

    countryLabel: 'Country',
    streetLabel: 'Street',
    streetPlaceholder: 'Street and number',
    cityLabel: 'City',
    cityPlaceholder: 'Madrid',
    regionLabel: 'Region',
    regionPlaceholder: 'State / province',
    postalCodeLabel: 'Postal code',
    postalCodeOptional: '(optional)',
    postalCodePlaceholder: '28001',

    submitIdle: 'Create account',
    submitLoading: 'Creating account…',
    prototypeHint: 'Prototype: registering starts a demo session.',
    errorGeneric: "We couldn't create your account. Please try again.",
    requiredHint: '* Required field',
  },
} as const
