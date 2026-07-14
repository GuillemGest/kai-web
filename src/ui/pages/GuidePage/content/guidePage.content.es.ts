/**
 * Documento de textos de la página de guía (Guide detail).
 *
 * Centraliza el "chrome" textual de GuidePage. El contenido concreto de cada
 * guía (título, intro, pasos) vive en `guides.content.ts` — compartido con la
 * página de Recursos.
 *
 * Regla: si aparece un texto nuevo en GuidePage, va aquí, no en el JSX.
 */
export const guidePageContent = {
  resourcesHref: '/recursos',

  breadcrumbAriaLabel: 'Migas de pan',
  backLabel: 'Centro de recursos',

  kickerPrefix: 'Guía · ',
  stepWordSingular: 'paso',
  stepWordPlural: 'pasos',

  // `{n}` = número de paso; `{total}` = pasos totales.
  stepLabelTemplate: 'Paso {n}',
  stepTotalTemplate: ' / {total}',

  foot: {
    title: '¿Te has quedado a medias?',
    text: 'Cuéntanos en qué punto estás y el equipo de KAI te ayuda con tu flujo concreto.',
    moreResourcesLabel: 'Ver más recursos',
    contactLabel: 'Contactar con soporte',
  },
} as const
