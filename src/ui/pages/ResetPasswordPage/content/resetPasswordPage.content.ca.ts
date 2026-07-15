/**
 * Traducció al català (ca) del contingut de ResetPasswordPage.
 */
export const resetPasswordPageContent = {
  form: {
    heading: 'Restableix la contrasenya',
    subheadingLead: 'Tria una nova contrasenya per a',
    subheadingFallback: 'Tria una nova contrasenya per al teu compte.',
    passwordLabel: 'Nova contrasenya',
    passwordPlaceholder: 'Entre 8 i 20 caràcters',
    repeatLabel: 'Repeteix la nova contrasenya',
    repeatPlaceholder: 'Torna a escriure-la',
    submitIdle: 'Desar contrasenya',
    submitLoading: 'Desant…',
    errorMismatch: 'Les contrasenyes no coincideixen.',
    errorWeakPassword: 'La contrasenya no compleix tots els requisits.',
    errorGeneric: 'No hem pogut actualitzar la teva contrasenya. Torna-ho a provar.',
    requirementsTitle: 'La contrasenya ha d’incloure:',
    passwordRequirements: {
      length: 'Entre 8 i 20 caràcters',
      uppercase: 'Una lletra majúscula',
      lowercase: 'Una lletra minúscula',
      number: 'Un número',
      symbol: 'Un símbol',
    },
  },
  success: {
    title: 'Contrasenya actualitzada!',
    body: 'La teva nova contrasenya està desada. Ja pots iniciar sessió amb ella.',
    redirectNotice: 'Et portem a l’inici de sessió d’aquí a uns segons…',
    cta: 'Anar a iniciar sessió',
  },
} as const
