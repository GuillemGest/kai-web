/**
 * English (en) translation of LoginPage content.
 */
export const loginPageContent = {
  brand: {
    quoteLead: 'Find the ',
    quoteEmphasis: 'key moments',
    quoteTail: ' without reviewing hours of footage.',
    quoteMeta:
      'KAI indexes your material, understands your queries in natural language and exports your selections straight into your editor.',
  },

  form: {
    heading: 'Sign in',
    subheading: 'Sign in to your account to continue.',
    emailLabel: 'Email',
    emailPlaceholder: 'you@email.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    submitIdle: 'Sign in',
    submitLoading: 'Signing in…',
    prototypeHint: 'Prototype: use demo@kai.app / kai1234 to sign in.',
    errorInvalidCredentials: 'Wrong credentials. Please try again.',
    // Second step: code verification (2FA).
    codeHeading: 'Verify your identity',
    codeSubheading: 'Enter the code we sent to your email.',
    codeLabel: 'Verification code',
    codePlaceholder: '••••••',
    codeSubmitIdle: 'Verify',
    codeSubmitLoading: 'Verifying…',
    codeBack: 'Back',
    errorInvalidCode: 'Wrong code. Please try again.',
    // Intermediate step: organization selection (multi-org accounts).
    orgSelectHeading: 'Choose an organization',
    orgSelectSubheading: 'Your account belongs to multiple organizations. Pick which one you want to sign in with.',
    orgSelectLabel: 'Organization',
    orgSelectSubmitIdle: 'Continue',
    orgSelectSubmitLoading: 'Continuing…',
    errorNoOrgSelected: 'Please select an organization to continue.',
    redirectAfterLogin: '/cuenta',
    registerPrompt: "Don't have an account?",
    registerLink: 'Create account',
  },
} as const
