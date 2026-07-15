/**
 * Documento de textos de la página de confirmación de cuenta (crear contraseña).
 *
 * Centraliza TODO el contenido textual de ConfirmAccountPage en un único objeto
 * tipado. Regla: si aparece un texto nuevo en la página, va aquí, no en el JSX.
 */
export const confirmAccountPageContent = {
  form: {
    heading: 'Crea tu contraseña',
    subheadingLead: 'Último paso para activar la cuenta de',
    subheadingFallback: 'Último paso para activar tu cuenta.',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: 'Entre 8 y 20 caracteres',
    repeatLabel: 'Repite la contraseña',
    repeatPlaceholder: 'Vuelve a escribirla',
    submitIdle: 'Confirmar cuenta',
    submitLoading: 'Confirmando…',
    errorMismatch: 'Las contraseñas no coinciden.',
    errorWeakPassword: 'La contraseña no cumple todos los requisitos.',
    errorGeneric: 'No hemos podido confirmar tu cuenta. Inténtalo de nuevo.',
    requirementsTitle: 'La contraseña debe incluir:',
    passwordRequirements: {
      length: 'Entre 8 y 20 caracteres',
      uppercase: 'Una letra mayúscula',
      lowercase: 'Una letra minúscula',
      number: 'Un número',
      symbol: 'Un símbolo',
    },
  },
  success: {
    title: '¡Cuenta confirmada!',
    body: 'Tu contraseña está creada. Ya puedes iniciar sesión con tu email y tu nueva contraseña.',
    redirectNotice: 'Te llevamos al inicio de sesión en unos segundos…',
    cta: 'Ir a iniciar sesión',
  },
} as const
