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
      'Un recorrido por la interfaz de Story Builder: conversaciones, el campo «Ask KAI», la playlist, las tarjetas de clips, el botón «Refine» y la exportación mediante «Export» con opciones EDL, XML y OTIO.',
    steps: [
      'Abre Story Builder y crea una conversación nueva, o recupera una que ya tengas en el proyecto.',
      'Escribe tu búsqueda en el campo «Ask KAI» con lenguaje natural. Puedes pedir una situación, un tema, una intervención concreta o un momento narrativo en particular.',
      'Revisa la respuesta de KAI y la playlist de clips resultante. Comprueba el vídeo, los timecodes y el resumen de la selección antes de continuar.',
      'Ajusta la selección desde las tarjetas de clips: revisa las descripciones, elimina lo que no encaje y reordena los fragmentos para construir la secuencia deseada.',
      'Utiliza «Refine» para afinar la búsqueda sin perder el contexto de la conversación.',
      'Cuando la selección esté lista, usa «Export» y elige una de las opciones disponibles —EDL, XML u OTIO—, según la configuración de tu flujo de edición.',
      'Traslada la selección exportada a tu editor y continúa el montaje.',
    ],
  },
  {
    slug: 'premiere-panel',
    title: 'Trabajar con KAI desde el panel de Adobe Premiere Pro',
    intro:
      'El panel de KAI para Adobe Premiere Pro se integra en tu flujo de edición. Desde él accedes a las conversaciones del proyecto, a sus versiones de selección y a un chat integrado, y añades los clips que KAI ha encontrado directamente en la línea de tiempo.',
    steps: [
      'Con el panel de KAI ya configurado en Adobe Premiere Pro, abre las conversaciones del proyecto desde la barra lateral del panel.',
      'Selecciona una conversación o una playlist creada previamente para reutilizar esas búsquedas y selecciones en lugar de empezar de cero.',
      'Compara las versiones de una selección —la original y sus refinamientos— para valorar distintas opciones narrativas antes de decidir.',
      'Cambia al modo «Chat» para solicitar nuevos criterios, ajustar una búsqueda o refinar la selección según el montaje en curso.',
      'Selecciona los clips que KAI ha encontrado e insértalos en la línea de tiempo desde el propio entorno de edición.',
    ],
  },
]

/** Devuelve la guía cuyo slug coincide, o undefined si no existe. */
export function findGuideBySlug(slug: string | undefined): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug)
}