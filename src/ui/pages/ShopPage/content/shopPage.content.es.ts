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
    customCtaLabel: 'Solicitar presupuesto',
    referencesLabel: 'Referencias orientativas',
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
    title: 'Un pricing por capas, del solo a la gran producción',
    lead: 'KAI combina suscripciones cloud recurrentes para usuarios y equipos con licencias enterprise por producción. Empieza con un plan cloud y escala a KAI 24/7 cuando tu producción lo pida.',
    notice: 'Pricing model v1. Precios orientativos que seguiremos refinando con feedback de mercado.',
  },

  error: {
    message: 'No hemos podido cargar los planes.',
    retry: 'Reintentar',
  },

  empty: {
    message: 'Aún no hay planes disponibles.',
    hint: 'Escríbenos y te contamos las opciones que mejor encajan con tu producción.',
    linkLabel: 'Hablar con nosotros',
    linkHref: '/recursos',
  },

  reassurance: [
    { iconName: 'CreditCard', text: 'Suscripción cloud recurrente para Pro/Solo y Team' },
    { iconName: 'ShieldCheck', text: 'Seguridad y compliance a medida en KAI 24/7' },
    { iconName: 'Headset', text: 'Soporte ajustado al alcance de cada producción' },
  ] as const,

  comparison: {
    title: 'Compara los niveles de KAI',
    lead: 'De la suscripción cloud individual a la licencia enterprise por producción. Cada nivel se ajusta a la escala, el volumen de material y las exigencias operativas.',
    planColumns: ['Audio Pro', 'Full Pro', 'Team', 'KAI 24/7'],
    a11y: { included: 'Incluido', notIncluded: 'No incluido' },
    sections: [
      {
        title: 'Modelo y despliegue',
        rows: [
          { label: 'Modalidad', values: ['Suscripción cloud', 'Suscripción cloud', 'Suscripción cloud', 'Licencia por producción'] },
          { label: 'Recursos cloud', values: ['Compartidos', 'Compartidos', 'Dedicados', 'A medida'] },
          { label: 'Despliegue on-premise', values: [false, false, false, true] },
          { label: 'Precio de referencia', values: ['59 €/mes', '149 €/mes', '299 €/mes', 'A medida'] },
        ],
      },
      {
        title: 'Capacidad y motores',
        rows: [
          { label: 'Capacidad de referencia', values: ['250 GB · 100 h', '250 GB · 100 h', '1 TB · 1.000 h', 'A medida'] },
          { label: 'Motor de audio', values: [true, true, true, true] },
          { label: 'Vídeo e IA avanzada', values: [false, true, true, true] },
          { label: 'Trabajo colaborativo', values: [false, false, true, true] },
          { label: 'Seguridad / compliance a medida', values: [false, false, false, true] },
          { label: 'Continuidad operativa', values: [false, false, false, true] },
        ],
      },
    ],
  },

  faq: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Qué diferencia hay entre Audio Pro y Full Pro?',
        a: 'Ambos son planes cloud de entrada con 250 GB o 100 h de referencia. Audio Pro (desde 59 €/mes) se orienta a modelos centrados en audio; Full Pro (desde 149 €/mes) desbloquea todos los motores: audio, vídeo e IA avanzada.',
      },
      {
        q: '¿Para quién es KAI Team?',
        a: 'Para equipos pequeños o medianos que necesitan más capacidad y fiabilidad. Es un plan cloud por equipo (299 €/mes de referencia) con 1 TB o 1.000 h y recursos cloud dedicados para mejorar rendimiento y previsibilidad.',
      },
      {
        q: '¿Cómo se calcula el precio de KAI 24/7?',
        a: 'KAI 24/7 no tiene tarifa fija: es una cotización a medida por producción. El precio depende del número de cámaras o señales, días de rodaje, volumen de ingesta, funcionalidades, integraciones, nivel de soporte y restricciones de despliegue.',
      },
      {
        q: '¿Qué son las referencias de 30.000 € y 9.000 €?',
        a: 'Son referencias comerciales orientativas: Premium Reality Shows en torno a 30.000 € (media ~3 meses) y Small Reality Shows en torno a 9.000 € (media ~1,5 meses). Las grandes producciones se presupuestan bajo demanda.',
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
