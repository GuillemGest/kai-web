/**
 * Traducció al català (ca) del contingut de LoginPage.
 */
export const loginPageContent = {
  brand: {
    videoSrc: '/demo.mp4',
    videoAlt: 'Demostració de KAI localitzant moments clau en vídeo',
    quoteLead: 'Troba els ',
    quoteEmphasis: 'moments clau',
    quoteTail: ' sense revisar hores de metratge.',
    quoteMeta:
      'KAI indexa el teu material, entén cerques en llenguatge natural i exporta les seleccions directament al teu editor.',
  },

  form: {
    heading: 'Iniciar sessió',
    subheading: 'Accedeix al teu compte per continuar.',
    emailLabel: 'Correu electrònic',
    emailPlaceholder: 'tu@email.com',
    passwordLabel: 'Contrasenya',
    passwordPlaceholder: '••••••••',
    submitIdle: 'Entrar',
    submitLoading: 'Entrant…',
    prototypeHint: 'Prototip: qualsevol credencial inicia sessió.',
    errorInvalidCredentials: 'Credencials incorrectes. Torna-ho a provar.',
    redirectAfterLogin: '/cuenta',
  },
} as const
