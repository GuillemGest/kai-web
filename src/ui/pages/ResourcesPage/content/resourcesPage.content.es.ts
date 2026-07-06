/**
 * Documento de textos de la página de Recursos (Centro de recursos / ayuda).
 *
 * Centraliza el contenido textual propio de la página (cabecera, buscador, CTA
 * y guías) para que no quede hardcodeado en el JSX y traducir sea trivial.
 *
 * OJO: los recursos/artículos NO viven aquí. Su fuente de datos es el módulo
 * DDD `modules/resources` (InMemoryResourceRepository), consumido vía use case.
 * Las guías viven en `guides.content.ts` (las comparten Recursos y GuidePage).
 * Aquí solo va el "chrome" de la página.
 */
export const resourcesPageContent = {
  supportEmail: 'soporte@kai.app',

  head: {
    badge: 'Centro de recursos',
    title: '¿En qué podemos ayudarte?',
    lead: 'Encuentra respuestas rápidas sobre instalación, cuenta, planes, indexado, búsqueda en lenguaje natural y exportación al editor.',
    searchPlaceholder: 'Busca: instalar, indexar, exportar, plan, NLE…',
    searchAriaLabel: 'Buscar en el centro de recursos',
  },

  status: {
    loading: 'Cargando recursos…',
    // `{count}` = número; `{query}` = término buscado.
    resultsWithQuerySingularTemplate: '{count} resultado para «{query}»',
    resultsWithQueryPluralTemplate: '{count} resultados para «{query}»',
    resultsIdleSingularTemplate: '{count} recurso disponible',
    resultsIdlePluralTemplate: '{count} recursos disponibles',
  },

  index: {
    ariaLabel: 'Categorías',
    label: 'Categorías',
  },

  empty: {
    // `{query}` = término buscado.
    titleTemplate: 'Sin resultados para «{query}»',
    body: 'Prueba con otra palabra o escríbenos y te ayudamos con tu caso concreto.',
    clearButton: 'Limpiar búsqueda',
    contactButton: 'Escribir a soporte',
  },

  cta: {
    title: '¿Necesitas ayuda con tu producción?',
    lead: 'Cuéntanos tu caso y el equipo de KAI te ayudará a revisar la mejor configuración para tu flujo de trabajo, tu volumen de material y tu editor.',
    button: 'Contactar con soporte',
  },

  /** Cabecera de la sección de guías que se lista en la página de Recursos. */
  guides: {
    title: 'Guías paso a paso',
    badge: 'Guías',
    // Metadatos de cada tarjeta de guía. `{count}` = número.
    meta: {
      stepsTemplate: '{count} pasos',
      minutesTemplate: '{count} min',
      moreStepsTemplate: '+{count} pasos más',
      open: 'Abrir guía',
    },
  },
} as const
