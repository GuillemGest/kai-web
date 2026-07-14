/**
 * English (en) translation of ConfirmAccountPage content.
 */
export const confirmAccountPageContent = {
  form: {
    heading: 'Create your password',
    subheadingLead: 'Last step to activate the account for',
    subheadingFallback: 'Last step to activate your account.',
    passwordLabel: 'Password',
    passwordPlaceholder: 'At least 8 characters',
    repeatLabel: 'Repeat password',
    repeatPlaceholder: 'Type it again',
    submitIdle: 'Confirm account',
    submitLoading: 'Confirming…',
    errorMismatch: 'Passwords do not match.',
    errorWeakPassword: 'The password must be at least 8 characters long.',
    errorGeneric: "We couldn't confirm your account. Please try again.",
  },
  success: {
    title: 'Account confirmed!',
    body: 'Your password is set. You can now sign in with your email and your new password.',
    redirectNotice: 'Taking you to the sign-in page in a few seconds…',
    cta: 'Go to sign in',
  },
} as const
