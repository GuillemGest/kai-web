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
    title: 'Elige el plan que va con tu ritmo',
    lead: 'Suscripción mensual a KAI con todas sus actualizaciones. Empieza pequeño y sube de plan cuando tu volumen de vídeo lo pida.',
    notice: 'Precios orientativos; el importe definitivo se confirma en el checkout.',
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
    { iconName: 'ShieldCheck', text: 'Sin permanencia, cancela cuando quieras' },
    { iconName: 'CreditCard', text: 'Facturación mensual, sin sorpresas' },
    { iconName: 'Headset', text: 'Soporte por personas, no bots' },
  ] as const,

  comparison: {
    title: 'Compara todas las características',
    lead: 'KAI ofrece planes para creadores individuales y equipos, para acelerar la postproducción sin fricciones.',
    planColumns: ['Individual', 'Pro', 'Studio'],
    a11y: { included: 'Incluido', notIncluded: 'No incluido' },
    sections: [
      {
        title: 'Funciones principales',
        rows: [
          { label: 'Transcripción avanzada e identificación de hablantes', values: [true, true, true] },
          { label: 'Resúmenes y análisis', values: [true, true, true] },
          { label: 'Cortes rápidos con IA', values: [false, true, true] },
          { label: 'Notas en lenguaje natural para guiar edits', values: [false, true, true] },
          { label: 'Ediciones mensuales incluidas', values: ['20', 'Ilimitadas', 'Ilimitadas'] },
          { label: 'Horas de vídeo ingestadas al mes', values: ['2 h', '20 h', 'Ilimitadas'] },
        ],
      },
      {
        title: 'Funciones avanzadas',
        rows: [
          { label: 'Multi-edits en todo tu footage', values: [false, true, true] },
          { label: 'Colaboración en equipo', values: [false, false, true] },
          { label: 'Personalización de IA', values: [false, true, true] },
          { label: 'Soporte', values: ['Email', 'Prioritario', 'Dedicado'] },
          { label: 'Seguridad', values: [true, true, 'Enterprise'] },
          { label: 'Gestión de equipos', values: [false, false, true] },
          { label: 'SSO', values: [false, false, true] },
        ],
      },
    ],
  },

  faq: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Puedo cambiar de plan más adelante?',
        a: 'Sí. Puedes subir o bajar de plan en cualquier momento desde tu cuenta; el cambio se prorratea en la siguiente factura.',
      },
      {
        q: '¿Hay permanencia o compromiso anual?',
        a: 'No. Todos los planes son mensuales y puedes cancelar cuando quieras. Sigues teniendo acceso hasta el final del periodo pagado.',
      },
      {
        q: '¿Los precios incluyen IVA?',
        a: 'Los precios se muestran sin IVA. El impuesto aplicable se calcula en el checkout según tu país y datos de facturación.',
      },
      {
        q: '¿Qué pasa si supero las horas de vídeo de mi plan?',
        a: 'Te avisamos antes de llegar al límite. Puedes esperar al siguiente ciclo o subir de plan al instante para seguir trabajando.',
      },
      {
        q: '¿Necesito tarjeta para empezar?',
        a: 'Para suscribirte sí. La suscripción activa la búsqueda con IA y la exportación.',
      },
    ],
  },
} as const

export type ShopReassuranceIcon = (typeof shopPageContent.reassurance)[number]['iconName']
