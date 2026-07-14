/**
 * English (en) translation of RegisterPage content.
 */
export const registerPageContent = {
  brand: {
    quoteLead: 'Create your account and start ',
    quoteEmphasis: 'saving hours',
    quoteTail: ' of footage review.',
    quoteMeta:
      'We only need your contact details: create your account and start using KAI in minutes.',
  },

  form: {
    heading: 'Create account',
    subheading: 'Fill in your details to get started with KAI.',
    loginPrompt: 'Already have an account?',
    loginLink: 'Sign in',

    sectionContact: 'Contact details',

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
    phoneOptional: '(optional)',
    phonePlaceholder: '+1 555 000 0000',

    termsLabelLead: 'I accept the',
    termsLinkLabel: 'terms and conditions',
    newsletterLabel: 'I want to receive the KAI newsletter',

    submitIdle: 'Create account',
    submitLoading: 'Creating account…',
    prototypeHint: 'Prototype: registering starts a demo session.',
    errorGeneric: "We couldn't create your account. Please try again.",
    errorTermsRequired: 'You must accept the terms and conditions to continue.',
    requiredHint: '* Required field',

    sentTitle: 'Check your email',
    sentBodyLead: 'We have sent a message to',
    sentBodyTail: 'to confirm your email and create your password.',
    sentHint: "Can't find it? Check your spam folder.",
    sentDevButton: 'Temporary: open the email link',
  },
} as const
