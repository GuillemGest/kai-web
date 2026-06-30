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
  head: {
    badge: 'Centro de recursos',
    title: '¿En qué podemos ayudarte?',
    lead: 'Encuentra respuestas rápidas sobre instalación, cuenta, planes, indexado, búsqueda en lenguaje natural y exportación al editor.',
    searchPlaceholder: 'Busca: instalar, indexar, exportar, plan, NLE…',
    searchAriaLabel: 'Buscar en el centro de recursos',
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
  },
} as const