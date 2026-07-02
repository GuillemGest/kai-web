/**
 * Documento de textos de la página 404 (NotFound).
 *
 * Centraliza TODO el contenido textual de NotFoundPage en un único objeto tipado.
 * Objetivo: que la página no tenga texto hardcodeado y que traducir a otro
 * idioma sea trivial — basta con duplicar este archivo (p. ej. notFoundPage.content.en.ts)
 * y seleccionar el locale en el futuro.
 *
 * Regla: si aparece un texto nuevo en NotFoundPage, va aquí, no en el JSX.
 */
export const notFoundPageContent = {
  code: '404',
  title: 'Página no encontrada',
  lead: 'La página que buscas no existe o se ha movido.',
  ctaLabel: 'Volver al inicio',
  ctaHref: '/',
} as const
