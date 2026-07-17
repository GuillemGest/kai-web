/**
 * Documento de textos del wizard de compra (Checkout).
 *
 * Centraliza TODO el contenido textual de CheckoutPage en un único objeto
 * tipado. Regla: si aparece un texto nuevo en el wizard, va aquí, no en el JSX.
 * Las plantillas usan `{placeholders}` que el island sustituye.
 */
export const checkoutPageContent = {
  heading: 'Completa tu compra',
  subheading: 'Tres pasos: elige tu plan, dinos a quién facturamos y paga de forma segura.',

  steps: {
    plan: 'Plan',
    billing: 'Datos de compra',
    payment: 'Pago',
  },

  loading: 'Cargando planes…',
  error: {
    message: 'No se han podido cargar los planes. Inténtalo de nuevo.',
    retry: 'Reintentar',
  },

  plan: {
    title: 'Tu plan',
    subtitle: 'Puedes cambiar de plan y añadir usuarios antes de pagar.',
    pricePeriodMonth: '/mes',
    includedUserNote: '1 usuario incluido',
    extraSeatsLabel: 'Usuarios adicionales',
    extraSeatsHint: 'Cada usuario adicional suma {price} €/mes.',
    extraSeatsMax: 'Hasta {max} usuarios adicionales en este plan.',
    extraSeatsNone: 'Este plan es individual: no admite usuarios adicionales.',
    seatsDecreaseAria: 'Quitar un usuario adicional',
    seatsIncreaseAria: 'Añadir un usuario adicional',
    summaryBaseLabel: 'Plan {name}',
    summarySeatsLabel: '{count} × usuario adicional',
    totalLabel: 'Total',
    continue: 'Continuar',
  },

  billing: {
    title: 'Información de facturación',
    subtitle: 'Elige tipo de comprador. Los campos marcados son obligatorios.',
    tabs: {
      personal: 'Uso personal',
      company: 'Uso empresa',
      ariaLabel: 'Tipo de comprador',
    },
    // ⚠️ PROVISIONAL: botón de desarrollo para rellenar el formulario en pruebas.
    devFillButton: 'Rellenar con datos de prueba',
    fields: {
      fullName: {
        label: 'Nombre completo',
        placeholder: 'Nombre y apellidos',
        error: 'Indica tu nombre completo.',
      },
      legalName: {
        label: 'Razón social',
        placeholder: 'Nombre legal de la empresa o autónomo',
        error: 'Indica la razón social (mínimo 3 caracteres).',
      },
      taxId: {
        label: 'NIF / CIF',
        placeholder: 'B12345678',
        error: 'Indica un NIF/CIF válido.',
      },
      billingEmail: {
        label: 'Email de facturación',
        placeholder: 'facturas@tuempresa.com',
        error: 'Indica un email válido.',
        hint: 'Es el email de tu cuenta y no se puede modificar.',
      },
      addressLine: {
        label: 'Dirección',
        placeholder: 'Calle y número',
        error: 'Indica la dirección fiscal.',
      },
      city: {
        label: 'Ciudad',
        placeholder: 'Barcelona',
        error: 'Indica la ciudad.',
      },
      postalCode: {
        label: 'Código postal',
        placeholder: '08001',
        error: 'Indica un código postal válido.',
      },
      province: {
        label: 'Provincia',
        placeholder: 'Barcelona',
        error: 'Indica la provincia.',
      },
      country: {
        label: 'País',
        error: 'Selecciona un país.',
      },
    },
    countryOptions: [
      { code: 'ES', label: 'España' },
      { code: 'AD', label: 'Andorra' },
      { code: 'PT', label: 'Portugal' },
      { code: 'FR', label: 'Francia' },
      { code: 'IT', label: 'Italia' },
      { code: 'DE', label: 'Alemania' },
      { code: 'GB', label: 'Reino Unido' },
      { code: 'US', label: 'Estados Unidos' },
      { code: 'MX', label: 'México' },
      { code: 'AR', label: 'Argentina' },
    ],
    back: 'Volver',
    continue: 'Continuar',
  },

  payment: {
    title: 'Revisa y paga',
    subtitle: 'Comprueba el resumen antes de continuar al pago seguro.',
    planLabel: 'Plan',
    usersLabel: 'Usuarios',
    usersValue: '{count} en total (1 incluido + {extra} adicionales)',
    usersValueSingle: '1 usuario incluido',
    seatsLine: '{count} × usuario adicional ({price} €/mes cada uno)',
    billingTitle: 'Facturar a',
    totalLabel: 'Total',
    pricePeriodMonth: '/mes',
    payIdle: 'Pagar',
    payLoading: 'Redirigiendo…',
    secureNote: 'Pago seguro. No guardamos tu tarjeta.',
    errorGeneric: 'No se pudo iniciar el pago. Inténtalo de nuevo.',
    /** Se muestra cuando la cuenta ya tiene una suscripción (máximo una por cuenta). */
    errorSubscriptionLimit: 'Ya tienes una suscripción activa. Solo se permite una por cuenta.',
    manageSubscriptionLink: 'Gestionar mi suscripción',
    back: 'Volver',
  },
} as const
