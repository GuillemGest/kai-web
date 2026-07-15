/**
 * Traducció al català (ca) del contingut de ForgotPasswordPage.
 */
export const forgotPasswordPageContent = {
  brand: {
    quoteLead: 'Recupera l’accés als teus ',
    quoteEmphasis: 'moments clau',
    quoteTail: ' en qüestió de segons.',
    quoteMeta:
      'T’enviarem un enllaç per establir una nova contrasenya i tornar al teu material sense perdre el ritme.',
  },

  form: {
    heading: 'Recupera la contrasenya',
    subheading: 'Escriu el correu del teu compte i t’enviarem un enllaç per crear una nova contrasenya.',
    emailLabel: 'Correu electrònic',
    emailPlaceholder: 'tu@email.com',
    submitIdle: 'Enviar enllaç',
    submitLoading: 'Enviant…',
    errorEmailRequired: 'Escriu el teu correu per recuperar la contrasenya.',
    errorEmailInvalid: 'Indica un correu vàlid.',
    backToLogin: 'Tornar a iniciar sessió',
  },

  sent: {
    title: 'Revisa el teu correu',
    bodyLead: 'Hem enviat un enllaç a',
    bodyTail: 'perquè puguis establir una nova contrasenya.',
    hint: 'Si no el veus en uns minuts, revisa la carpeta de correu brossa.',
    // ⚠️ PROVISIONAL: mentre no existeixi l’enviament real de correu, simula
    // l’enllaç del correu i porta a la pàgina de crear contrasenya.
    devButton: 'Simular enllaç del correu',
  },
} as const
