/**
 * Traducció al català (ca) del contingut de ConfirmAccountPage.
 */
export const confirmAccountPageContent = {
  form: {
    heading: 'Crea la teva contrasenya',
    subheadingLead: 'Últim pas per activar el compte de',
    subheadingFallback: 'Últim pas per activar el teu compte.',
    passwordLabel: 'Contrasenya',
    passwordPlaceholder: 'Mínim 8 caràcters',
    repeatLabel: 'Repeteix la contrasenya',
    repeatPlaceholder: 'Torna a escriure-la',
    submitIdle: 'Confirmar compte',
    submitLoading: 'Confirmant…',
    errorMismatch: 'Les contrasenyes no coincideixen.',
    errorWeakPassword: 'La contrasenya ha de tenir com a mínim 8 caràcters.',
    errorGeneric: 'No hem pogut confirmar el teu compte. Torna-ho a provar.',
  },
  success: {
    title: 'Compte confirmat!',
    body: 'La teva contrasenya està creada. Ja pots iniciar sessió amb el teu email i la teva nova contrasenya.',
    redirectNotice: 'Et portem a l’inici de sessió d’aquí a uns segons…',
    cta: 'Anar a iniciar sessió',
  },
} as const
