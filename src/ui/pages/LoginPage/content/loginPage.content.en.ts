/**
 * English (en) translation of LoginPage content.
 */
export const loginPageContent = {
  brand: {
    videoSrc: '/demo.mp4',
    videoAlt: 'Demo of KAI locating key moments in video',
    quoteLead: 'Find the ',
    quoteEmphasis: 'key moments',
    quoteTail: ' without reviewing hours of footage.',
    quoteMeta:
      'KAI indexes your material, understands natural-language queries and exports selections straight to your editor.',
  },

  form: {
    heading: 'Sign in',
    subheading: 'Access your account to continue.',
    emailLabel: 'Email',
    emailPlaceholder: 'you@email.com',
    passwordLabel: 'Password',
    passwordPlaceholder: '••••••••',
    submitIdle: 'Sign in',
    submitLoading: 'Signing in…',
    prototypeHint: 'Prototype: any credentials will sign you in.',
    errorInvalidCredentials: 'Wrong credentials. Please try again.',
    redirectAfterLogin: '/cuenta',
  },
} as const
