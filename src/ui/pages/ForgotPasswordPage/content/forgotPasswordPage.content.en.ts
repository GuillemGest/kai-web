/**
 * English (en) translation of ForgotPasswordPage content.
 */
export const forgotPasswordPageContent = {
  brand: {
    quoteLead: 'Recover access to your ',
    quoteEmphasis: 'key moments',
    quoteTail: ' in a matter of seconds.',
    quoteMeta:
      'We’ll send you a link to set a new password and get back to your material without missing a beat.',
  },

  form: {
    heading: 'Recover your password',
    subheading: 'Enter your account email and we’ll send you a link to create a new password.',
    emailLabel: 'Email',
    emailPlaceholder: 'you@email.com',
    submitIdle: 'Send link',
    submitLoading: 'Sending…',
    errorEmailRequired: 'Enter your email to recover your password.',
    errorEmailInvalid: 'Enter a valid email.',
    backToLogin: 'Back to sign in',
  },

  sent: {
    title: 'Check your inbox',
    bodyLead: 'We sent a link to',
    bodyTail: 'so you can set a new password.',
    hint: 'If you don’t see it within a few minutes, check your spam folder.',
    // ⚠️ PROVISIONAL: until real email delivery exists, this simulates the
    // email link and goes to the set-password page.
    devButton: 'Simulate email link',
  },
} as const
