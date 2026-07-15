/**
 * Documento de textos de la página de recuperación de contraseña.
 *
 * Centraliza TODO el contenido textual de ForgotPasswordPage en un único objeto
 * tipado. Regla: si aparece un texto nuevo en la página, va aquí, no en el JSX.
 */
export const forgotPasswordPageContent = {
  brand: {
    // El asterisco delimita el fragmento resaltado dentro del quote (em).
    quoteLead: 'Recupera el acceso a tus ',
    quoteEmphasis: 'momentos clave',
    quoteTail: ' en cuestión de segundos.',
    quoteMeta:
      'Te enviaremos un enlace para establecer una nueva contraseña y volver a tu material sin perder el ritmo.',
  },

  form: {
    heading: 'Recupera tu contraseña',
    subheading: 'Escribe el email de tu cuenta y te enviaremos un enlace para crear una nueva contraseña.',
    emailLabel: 'Email',
    emailPlaceholder: 'tu@email.com',
    submitIdle: 'Enviar enlace',
    submitLoading: 'Enviando…',
    errorEmailRequired: 'Escribe tu email para recuperar la contraseña.',
    errorEmailInvalid: 'Indica un email válido.',
    backToLogin: 'Volver a iniciar sesión',
  },

  sent: {
    title: 'Revisa tu correo',
    bodyLead: 'Hemos enviado un enlace a',
    bodyTail: 'para que puedas establecer una nueva contraseña.',
    hint: 'Si no lo ves en unos minutos, revisa la carpeta de spam.',
    // ⚠️ PROVISIONAL: mientras no exista el envío real de correo, simula el
    // enlace del email y lleva a la página de crear contraseña.
    devButton: 'Simular enlace del correo',
  },
} as const
