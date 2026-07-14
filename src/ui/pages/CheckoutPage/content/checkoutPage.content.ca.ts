/** Textos en català del wizard de compra. Mirall de checkoutPage.content.es.ts. */
export const checkoutPageContent = {
  heading: 'Completa la teva compra',
  subheading: 'Tres passos: tria el teu pla, digue’ns a qui facturem i paga de manera segura.',

  steps: {
    plan: 'Pla',
    billing: 'Dades de compra',
    payment: 'Pagament',
  },

  loading: 'Carregant plans…',
  error: {
    message: 'No s’han pogut carregar els plans. Torna-ho a provar.',
    retry: 'Reintenta',
  },

  plan: {
    title: 'El teu pla',
    subtitle: 'Pots canviar de pla i afegir usuaris abans de pagar.',
    pricePeriodMonth: '/mes',
    includedUserNote: '1 usuari inclòs',
    extraSeatsLabel: 'Usuaris addicionals',
    extraSeatsHint: 'Cada usuari addicional suma {price} €/mes.',
    extraSeatsMax: 'Fins a {max} usuaris addicionals en aquest pla.',
    extraSeatsNone: 'Aquest pla és individual: no admet usuaris addicionals.',
    seatsDecreaseAria: 'Treure un usuari addicional',
    seatsIncreaseAria: 'Afegir un usuari addicional',
    summaryBaseLabel: 'Pla {name}',
    summarySeatsLabel: '{count} × usuari addicional',
    totalLabel: 'Total',
    continue: 'Continua',
  },

  billing: {
    title: 'Dades de compra',
    subtitle: 'Les necessitem per emetre la teva factura. Tots els camps són obligatoris.',
    // ⚠️ PROVISIONAL: botó de desenvolupament per omplir el formulari en proves.
    devFillButton: 'Omple amb dades de prova',
    fields: {
      legalName: {
        label: 'Raó social',
        placeholder: 'Nom legal de l’empresa o autònom',
        error: 'Indica la raó social (mínim 3 caràcters).',
      },
      taxId: {
        label: 'NIF / CIF',
        placeholder: 'B12345678',
        error: 'Indica un NIF/CIF vàlid.',
      },
      billingEmail: {
        label: 'Email de facturació',
        placeholder: 'factures@laempresa.com',
        error: 'Indica un email vàlid.',
      },
      addressLine: {
        label: 'Adreça',
        placeholder: 'Carrer i número',
        error: 'Indica l’adreça fiscal.',
      },
      city: {
        label: 'Ciutat',
        placeholder: 'Barcelona',
        error: 'Indica la ciutat.',
      },
      postalCode: {
        label: 'Codi postal',
        placeholder: '08001',
        error: 'Indica un codi postal vàlid.',
      },
      province: {
        label: 'Província',
        placeholder: 'Barcelona',
        error: 'Indica la província.',
      },
      country: {
        label: 'País',
        error: 'Selecciona un país.',
      },
    },
    countryOptions: [
      { code: 'ES', label: 'Espanya' },
      { code: 'AD', label: 'Andorra' },
      { code: 'PT', label: 'Portugal' },
      { code: 'FR', label: 'França' },
      { code: 'IT', label: 'Itàlia' },
      { code: 'DE', label: 'Alemanya' },
      { code: 'GB', label: 'Regne Unit' },
      { code: 'US', label: 'Estats Units' },
      { code: 'MX', label: 'Mèxic' },
      { code: 'AR', label: 'Argentina' },
    ],
    back: 'Torna',
    continue: 'Continua',
  },

  payment: {
    title: 'Revisa i paga',
    subtitle: 'Comprova el resum abans de continuar al pagament segur.',
    planLabel: 'Pla',
    usersLabel: 'Usuaris',
    usersValue: '{count} en total (1 inclòs + {extra} addicionals)',
    usersValueSingle: '1 usuari inclòs',
    seatsLine: '{count} × usuari addicional ({price} €/mes cadascun)',
    billingTitle: 'Facturar a',
    totalLabel: 'Total',
    pricePeriodMonth: '/mes',
    payIdle: 'Paga amb Stripe',
    payLoading: 'Redirigint a Stripe…',
    secureNote: 'Pagament segur gestionat per Stripe. No guardem la teva targeta.',
    errorGeneric: 'No s’ha pogut iniciar el pagament. Torna-ho a provar.',
    back: 'Torna',
  },
} as const
