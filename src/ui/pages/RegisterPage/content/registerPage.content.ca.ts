/**
 * Traducció al català (ca) del contingut de RegisterPage.
 */
export const registerPageContent = {
  brand: {
    quoteLead: 'Crea el teu compte i comença a ',
    quoteEmphasis: 'estalviar hores',
    quoteTail: ' de revisió de metratge.',
    quoteMeta:
      'Només necessitem les teves dades de contacte: crea el teu compte i comença a fer servir KAI en minuts.',
  },

  form: {
    heading: 'Crear compte',
    subheading: 'Completa les teves dades per començar amb KAI.',
    loginPrompt: 'Ja tens compte?',
    loginLink: 'Inicia sessió',

    sectionContact: 'Dades de contacte',

    firstNameLabel: 'Nom',
    firstNamePlaceholder: 'Anna',
    lastNameLabel: 'Cognom',
    lastNamePlaceholder: 'García',
    companyLabel: 'Empresa',
    companyOptional: '(opcional)',
    companyPlaceholder: 'Nom de la teva empresa',
    emailLabel: 'Correu electrònic',
    emailPlaceholder: 'tu@email.com',
    phoneLabel: 'Telèfon',
    phoneOptional: '(opcional)',
    phonePlaceholder: '+34 600 000 000',

    termsLabelLead: 'Accepto els',
    termsLinkLabel: 'termes i condicions',
    newsletterLabel: 'Vull rebre la newsletter de KAI',

    submitIdle: 'Crear compte',
    submitLoading: 'Creant compte…',
    prototypeHint: 'Prototip: el registre crea una sessió de demostració.',
    errorGeneric: 'No hem pogut crear el teu compte. Torna-ho a provar.',
    errorTermsRequired: 'Has d’acceptar els termes i condicions per continuar.',
    errorFirstNameRequired: 'Introdueix el teu nom.',
    errorLastNameRequired: 'Introdueix el teu cognom.',
    errorEmailRequired: 'Introdueix el teu correu electrònic.',
    errorEmailInvalid: 'Introdueix un correu electrònic vàlid (p. ex. ana@email.com).',
    errorPhoneInvalid: 'Introdueix un telèfon vàlid.',
    requiredHint: '* Camp obligatori',

    sentTitle: 'Revisa el teu correu',
    sentBodyLead: 'Hem enviat un missatge a',
    sentBodyTail: 'per confirmar el teu email i crear la teva contrasenya.',
    sentHint: 'Si no el trobes, mira la carpeta de correu brossa.',
    sentDevButton: 'Provisional: obrir l’enllaç del correu',
    fillGapsButton: 'Provisional: emplenar camps amb dades d’exemple',
  },
} as const
