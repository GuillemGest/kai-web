/**
 * English (en) translation of ResetPasswordPage content.
 */
export const resetPasswordPageContent = {
  form: {
    heading: 'Reset your password',
    subheadingLead: 'Choose a new password for',
    subheadingFallback: 'Choose a new password for your account.',
    passwordLabel: 'New password',
    passwordPlaceholder: 'Between 8 and 20 characters',
    repeatLabel: 'Repeat new password',
    repeatPlaceholder: 'Type it again',
    submitIdle: 'Save password',
    submitLoading: 'Saving…',
    errorMismatch: 'Passwords do not match.',
    errorWeakPassword: 'The password does not meet all the requirements.',
    errorGeneric: "We couldn't update your password. Please try again.",
    requirementsTitle: 'The password must include:',
    passwordRequirements: {
      length: 'Between 8 and 20 characters',
      uppercase: 'One uppercase letter',
      lowercase: 'One lowercase letter',
      number: 'One number',
      symbol: 'One symbol',
    },
  },
  success: {
    title: 'Password updated!',
    body: 'Your new password is saved. You can now sign in with it.',
    redirectNotice: 'Taking you to the sign-in page in a few seconds…',
    cta: 'Go to sign in',
  },
} as const
