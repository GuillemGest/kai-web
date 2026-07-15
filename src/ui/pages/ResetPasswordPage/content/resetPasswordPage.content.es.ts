/**
 * Documento de textos de la página de restablecer contraseña (destino del enlace
 * del correo de recuperación).
 *
 * Mismo estilo visual que ConfirmAccountPage, pero con textos propios: aquí NO
 * se activa una cuenta, se define una contraseña nueva para una cuenta existente.
 * Regla: si aparece un texto nuevo en la página, va aquí, no en el JSX.
 */
export const resetPasswordPageContent = {
  form: {
    heading: 'Restablece tu contraseña',
    subheadingLead: 'Elige una nueva contraseña para',
    subheadingFallback: 'Elige una nueva contraseña para tu cuenta.',
    passwordLabel: 'Nueva contraseña',
    passwordPlaceholder: 'Entre 8 y 20 caracteres',
    repeatLabel: 'Repite la nueva contraseña',
    repeatPlaceholder: 'Vuelve a escribirla',
    submitIdle: 'Guardar contraseña',
    submitLoading: 'Guardando…',
    errorMismatch: 'Las contraseñas no coinciden.',
    errorWeakPassword: 'La contraseña no cumple todos los requisitos.',
    errorGeneric: 'No hemos podido actualizar tu contraseña. Inténtalo de nuevo.',
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
    title: '¡Contraseña actualizada!',
    body: 'Tu nueva contraseña está guardada. Ya puedes iniciar sesión con ella.',
    redirectNotice: 'Te llevamos al inicio de sesión en unos segundos…',
    cta: 'Ir a iniciar sesión',
  },
} as const
