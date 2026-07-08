/**
 * Traducció al català (ca) del contingut de RegisterPage.
 */
export const registerPageContent = {
  brand: {
    quoteLead: 'Crea el teu compte i comença a ',
    quoteEmphasis: 'estalviar hores',
    quoteTail: ' de revisió de metratge.',
    quoteMeta:
      'Les teves dades de facturació ens permeten activar la teva subscripció i emetre les teves factures correctament des del primer dia.',
  },

  form: {
    heading: 'Crear compte',
    subheading: 'Completa les teves dades per començar amb KAI.',
    loginPrompt: 'Ja tens compte?',
    loginLink: 'Inicia sessió',

    sectionContact: 'Dades de contacte',
    sectionBilling: 'Adreça de facturació',

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
    phonePlaceholder: '+34 600 000 000',

    countryLabel: 'País',
    streetLabel: 'Carrer',
    streetPlaceholder: 'Carrer i número',
    cityLabel: 'Ciutat',
    cityPlaceholder: 'Barcelona',
    regionLabel: 'Regió',
    regionPlaceholder: 'Catalunya',
    postalCodeLabel: 'Codi postal',
    postalCodeOptional: '(opcional)',
    postalCodePlaceholder: '08001',

    submitIdle: 'Crear compte',
    submitLoading: 'Creant compte…',
    prototypeHint: 'Prototip: el registre crea una sessió de demostració.',
    errorGeneric: 'No hem pogut crear el teu compte. Torna-ho a provar.',
    requiredHint: '* Camp obligatori',
  },
} as const
