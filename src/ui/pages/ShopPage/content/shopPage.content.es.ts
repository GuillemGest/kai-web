/**
 * Documento de textos de la página de planes/tienda (Shop).
 *
 * Centraliza TODO el contenido textual de ShopPage en un único objeto tipado.
 * Objetivo: que la página no tenga texto hardcodeado y que traducir a otro
 * idioma sea trivial — basta con duplicar este archivo (p. ej. shopPage.content.en.ts)
 * y seleccionar el locale en el futuro.
 *
 * OJO: los planes (nombre, precio, features) NO viven aquí. Se cargan vía el
 * módulo DDD `modules/billing` (InMemoryPlanRepository), consumido por use case.
 * Aquí solo va el "chrome" de la página.
 *
 * Regla: si aparece un texto nuevo en ShopPage, va aquí, no en el JSX.
 */
export const shopPageContent = {
  planCard: {
    popularBadge: 'Más popular',
    pricePeriodMonth: '/mes',
    pricePeriodYear: '/año',
    priceFromPrefix: 'desde',
    customPriceLabel: 'A medida',
    freePriceLabel: 'Gratis',
    customCtaLabel: 'Solicitar presupuesto',
    freeCtaLabel: 'Empezar gratis',
    selectCtaTemplate: 'Elegir {name}',
    discountBadgeTemplate: 'Ahorra {percent}%',
  },

  billingToggle: {
    label: 'Periodo de facturación',
    monthly: 'Mensual',
    yearly: 'Anual',
    savingsHint: 'Ahorra {percent}%',
  },

  yearlyDiscountPercent: 20,

  head: {
    title: 'Planes ajustados a cada proyecto',
    lead: 'KAI junta suscripciones cloud recurrentes para usuarios y equipos con licencias por producción para el trabajo enterprise. Empieza con un plan cloud y sube a KAI Enterprise cuando una producción te lo pida.',
    notice: 'Pricing model v1. Precios orientativos que seguiremos ajustando según el feedback del mercado.',
  },

  // Prueba gratis: chip destacado en el encabezado. Lleva al login arrastrando
  // el plan gratuito (?plan=free); tras entrar se muestra el aviso de prueba
  // iniciada en /cuenta. Visible siempre, con o sin sesión.
  freeTrial: {
    label: 'Prueba gratis',
    hint: '15 días · sin tarjeta',
    href: '/login?plan=free',
  },

  // KAI Enterprise: presencia discreta bajo el grid para quien no encaja en
  // ningún plan cerrado. Deriva a ventas por correo (cotización por producción).
  enterpriseContact: {
    label: 'KAI Enterprise',
    text: '¿Ninguno de estos planes encaja con tu producción? Cotizamos una licencia enterprise a medida.',
    ctaLabel: 'Hablar con ventas',
    emailSubject: 'Consulta KAI Enterprise',
  },

  error: {
    message: 'No hemos podido cargar los planes.',
    retry: 'Reintentar',
  },

  empty: {
    message: 'Aún no hay planes disponibles.',
    hint: 'Escríbenos y te indicaremos las opciones que mejor encajan con tu producción.',
    linkLabel: 'Hablar con nosotros',
    linkHref: '/recursos',
  },

  reassurance: [
    { iconName: 'CreditCard', text: 'Suscripción cloud recurrente para Pro/Solo y Team' },
    { iconName: 'ShieldCheck', text: 'Seguridad y compliance a medida en KAI Enterprise' },
    { iconName: 'Headset', text: 'Soporte ajustado a cada producción' },
  ] as const,

  comparison: {
    title: 'Compara los niveles de KAI',
    lead: 'De una suscripción cloud individual a una licencia enterprise por producción. Cada nivel se ajusta a la escala, el volumen de material y las exigencias del trabajo.',
    planColumns: ['KAI Free', 'KAI Audio Analysis', 'KAI Full', 'KAI Team'],
    a11y: { included: 'Incluido', notIncluded: 'No incluido' },
    sections: [
      {
        title: 'Modelo y despliegue',
        rows: [
          { label: 'Modalidad', values: ['Suscripción cloud', 'Suscripción cloud', 'Suscripción cloud', 'Suscripción cloud'] },
          { label: 'Recursos cloud', values: ['Compartidos', 'Compartidos', 'Compartidos', 'Dedicados'] },
          { label: 'Despliegue on-premise', values: [false, false, false, false] },
          { label: 'Precio de referencia', values: ['Gratis', '59 €/mes', '149 €/mes', '299 €/mes'] },
        ],
      },
      {
        title: 'Capacidad y motores',
        rows: [
          { label: 'Capacidad de referencia', values: ['2 GB · 1 h', '250 GB · 100 h', '250 GB · 100 h', '1 TB · 1.000 h'] },
          { label: 'Subida de vídeo', values: [false, true, true, true] },
          { label: 'Motor de audio', values: [false, true, true, true] },
          { label: 'Vídeo e IA avanzada', values: [false, false, true, true] },
          { label: 'Exportación al editor', values: [false, true, true, true] },
          { label: 'Trabajo colaborativo', values: [false, false, false, true] },
          { label: 'Seguridad / compliance a medida', values: [false, false, false, false] },
          { label: 'Continuidad operativa', values: [false, false, false, false] },
        ],
      },
    ],
  },

  faq: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Qué diferencia hay entre KAI Audio Analysis y KAI Full?',
        a: 'Ambos son planes cloud de entrada con 250 GB o 100 h de referencia. KAI Audio Analysis (desde 59 €/mes) se orienta a modelos centrados en audio, mientras que KAI Full (desde 149 €/mes) habilita todos los motores: audio, vídeo e IA avanzada.',
      },
      {
        q: '¿Para quién es KAI Team?',
        a: 'Para equipos pequeños y medianos que necesitan más capacidad y fiabilidad. Es un plan cloud por equipo (299 €/mes de referencia) con 1 TB o 1.000 h y recursos cloud dedicados, para mantener un rendimiento estable y previsible.',
      },
      {
        q: '¿Cómo se calcula el precio de KAI Enterprise?',
        a: 'KAI Enterprise no tiene tarifa fija: se cotiza por producción. El precio depende del número de cámaras o señales, los días de rodaje, el volumen de ingesta, las funcionalidades e integraciones necesarias, el nivel de soporte y las restricciones de despliegue.',
      },
      // Pregunta desactivada temporalmente (pendiente de decisión de negocio sobre el pricing v1).
      // {
      //   q: '¿El pricing es definitivo?',
      //   a: 'Es un pricing model v1. La política de precios seguirá refinándose con feedback de mercado para mantener la oferta flexible y competitiva en distintos perfiles de cliente y geografías.',
      // },
    ],
  },
} as const

export type ShopReassuranceIcon = (typeof shopPageContent.reassurance)[number]['iconName']
