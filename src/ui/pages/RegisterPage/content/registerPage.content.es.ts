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
      'Tus datos de facturación nos permiten activar tu suscripción y emitir tus facturas correctamente desde el primer día.',
  },

  form: {
    heading: 'Crear cuenta',
    subheading: 'Completa tus datos para empezar con KAI.',
    loginPrompt: '¿Ya tienes cuenta?',
    loginLink: 'Inicia sesión',

    sectionContact: 'Datos de contacto',
    sectionBilling: 'Dirección de facturación',

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
    phonePlaceholder: '+34 600 000 000',

    countryLabel: 'País',
    streetLabel: 'Calle',
    streetPlaceholder: 'Calle y número',
    cityLabel: 'Ciudad',
    cityPlaceholder: 'Madrid',
    regionLabel: 'Región',
    regionPlaceholder: 'Comunidad de Madrid',
    postalCodeLabel: 'Código postal',
    postalCodeOptional: '(opcional)',
    postalCodePlaceholder: '28001',

    submitIdle: 'Crear cuenta',
    submitLoading: 'Creando cuenta…',
    prototypeHint: 'Prototipo: el registro crea una sesión de demostración.',
    errorGeneric: 'No hemos podido crear tu cuenta. Inténtalo de nuevo.',
    requiredHint: '* Campo obligatorio',
  },
} as const
