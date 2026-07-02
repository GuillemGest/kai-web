/**
 * Guías paso a paso del centro de recursos.
 *
 * Fuente única consumida tanto por la página de Recursos (lista de títulos) como
 * por la página de detalle de cada guía (GuidePage). Por eso vive en su propio
 * archivo y no dentro de resourcesPage.content.ts.
 *
 * Solo se incluyen guías respaldadas por documentación oficial de KAI; no hay
 * guías de instalación, actualización, requisitos, seguridad ni formatos por
 * falta de información oficial concreta.
 */
export interface Guide {
  /** Slug en kebab-case usado en la URL (/recursos/guias/:slug). */
  slug: string
  title: string
  intro: string
  steps: readonly string[]
}

export const GUIDES: readonly Guide[] = [
  {
    slug: 'story-builder-export',
    title: 'Crear una selección y exportarla desde Story Builder',
    intro:
      'Pasos basados en la interfaz de Story Builder: conversaciones, campo «Ask KAI», playlist, tarjetas de clips, botón «Refine» y exportación mediante «Export» con opciones EDL, XML y OTIO.',
    steps: [
      'Abre Story Builder y crea una nueva conversación o recupera una conversación existente del proyecto.',
      'Escribe tu búsqueda en el campo «Ask KAI» usando lenguaje natural. Por ejemplo, puedes pedir una situación, un tema, una intervención o un momento narrativo concreto.',
      'Revisa la respuesta generada por KAI y la playlist de clips encontrada. Comprueba el vídeo, los timecodes y la información resumida de la selección antes de continuar.',
      'Ajusta la selección desde las tarjetas de clips: revisa las descripciones, elimina lo que no encaje y reordena los fragmentos cuando necesites construir una secuencia narrativa.',
      'Usa «Refine» para afinar la búsqueda sin perder el contexto de la conversación.',
      'Cuando la selección esté lista, utiliza «Export» y elige una de las opciones disponibles en la interfaz, como EDL, XML u OTIO, según el flujo de trabajo de edición configurado.',
      'Continúa el montaje en tu editor con la selección exportada.',
    ],
  },
  {
    slug: 'premiere-panel',
    title: 'Trabajar con KAI desde el panel de Adobe Premiere Pro',
    intro:
      'La documentación disponible describe el panel de KAI para Adobe Premiere Pro como una extensión del flujo de edición, con acceso a conversaciones del proyecto, versiones de selección, chat integrado y posibilidad de insertar clips identificados por IA en la línea de tiempo.',
    steps: [
      'Con el panel de KAI ya configurado en Adobe Premiere Pro, accede a las conversaciones asociadas al proyecto desde la barra lateral del panel.',
      'Selecciona una conversación o una playlist generada previamente para reutilizar búsquedas y selecciones sin reconstruir el trabajo desde cero.',
      'Revisa las versiones disponibles de una selección, como la original o sus refinamientos, para comparar alternativas narrativas antes de decidir.',
      'Usa el modo «Chat» para pedir nuevos criterios, ajustar una búsqueda o refinar la selección según el contexto del montaje.',
      'Selecciona los clips identificados por KAI que quieras utilizar y llévalos a la línea de tiempo desde el propio entorno de edición.',
    ],
  },
]

/** Devuelve la guía cuyo slug coincide, o undefined si no existe. */
export function findGuideBySlug(slug: string | undefined): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug)
}