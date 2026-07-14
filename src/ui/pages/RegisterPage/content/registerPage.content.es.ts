/**
 * Documento de textos de la página de registro (Registro).
 *
 * Centraliza TODO el contenido textual de RegisterPage en un único objeto tipado.
 * Regla: si aparece un texto nuevo en RegisterPage, va aquí, no en el JSX.
 */
export const registerPageContent = {
  brand: {
    quoteLead: 'Crea tu cuenta y empieza a ',
    quoteEmphasis: 'ahorrar horas',
    quoteTail: ' de revisión de metraje.',
    quoteMeta:
      'Solo necesitamos tus datos de contacto: crea tu cuenta y empieza a usar KAI en minutos.',
  },

  form: {
    heading: 'Crear cuenta',
    subheading: 'Completa tus datos para empezar con KAI.',
    loginPrompt: '¿Ya tienes cuenta?',
    loginLink: 'Inicia sesión',

    sectionContact: 'Datos de contacto',

    firstNameLabel: 'Nombre',
    firstNamePlaceholder: 'Ana',
    lastNameLabel: 'Apellido',
    lastNamePlaceholder: 'García',
    companyLabel: 'Empresa',
    companyOptional: '(opcional)',
    companyPlaceholder: 'Nombre de tu empresa',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@email.com',
    phoneLabel: 'Teléfono',
    phoneOptional: '(opcional)',
    phonePlaceholder: '+34 600 000 000',

    termsLabelLead: 'Acepto los',
    termsLinkLabel: 'términos y condiciones',
    newsletterLabel: 'Quiero recibir la newsletter de KAI',

    submitIdle: 'Crear cuenta',
    submitLoading: 'Creando cuenta…',
    prototypeHint: 'Prototipo: el registro crea una sesión de demostración.',
    errorGeneric: 'No hemos podido crear tu cuenta. Inténtalo de nuevo.',
    errorTermsRequired: 'Debes aceptar los términos y condiciones para continuar.',
    requiredHint: '* Campo obligatorio',

    sentTitle: 'Revisa tu correo',
    sentBodyLead: 'Hemos enviado un mensaje a',
    sentBodyTail: 'para confirmar tu email y crear tu contraseña.',
    sentHint: 'Si no lo encuentras, mira en la carpeta de spam.',
    sentDevButton: 'Provisional: abrir el enlace del correo',
  },
} as const
