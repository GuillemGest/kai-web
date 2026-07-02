/**
 * Traducció al català (ca) de les guies del centre de recursos.
 * Els valors `slug` són estables entre locales (URLs).
 */
export interface Guide {
  slug: string
  title: string
  intro: string
  steps: readonly string[]
}

export const GUIDES: readonly Guide[] = [
  {
    slug: 'story-builder-export',
    title: 'Crear una selecció i exportar-la des de Story Builder',
    intro:
      'Passos basats en la interfície de Story Builder: converses, camp «Ask KAI», playlist, targetes de clips, botó «Refine» i exportació mitjançant «Export» amb opcions EDL, XML i OTIO.',
    steps: [
      'Obre Story Builder i crea una nova conversa o recupera una conversa existent del projecte.',
      'Escriu la teva cerca al camp «Ask KAI» amb llenguatge natural. Per exemple, pots demanar una situació, un tema, una intervenció o un moment narratiu concret.',
      'Revisa la resposta generada per KAI i la playlist de clips trobada. Comprova el vídeo, els timecodes i la informació resumida de la selecció abans de continuar.',
      'Ajusta la selecció des de les targetes de clips: revisa les descripcions, elimina el que no encaixi i reordena els fragments quan necessitis construir una seqüència narrativa.',
      'Usa «Refine» per afinar la cerca sense perdre el context de la conversa.',
      'Quan la selecció estigui a punt, utilitza «Export» i tria una de les opcions disponibles a la interfície, com EDL, XML o OTIO, segons el flux de treball d’edició configurat.',
      'Continua el muntatge al teu editor amb la selecció exportada.',
    ],
  },
  {
    slug: 'premiere-panel',
    title: 'Treballar amb KAI des del panell d’Adobe Premiere Pro',
    intro:
      'La documentació disponible descriu el panell de KAI per a Adobe Premiere Pro com una extensió del flux d’edició, amb accés a converses del projecte, versions de selecció, chat integrat i possibilitat d’inserir clips identificats per IA a la línia de temps.',
    steps: [
      'Amb el panell de KAI ja configurat a Adobe Premiere Pro, accedeix a les converses associades al projecte des de la barra lateral del panell.',
      'Selecciona una conversa o una playlist generada prèviament per reutilitzar cerques i seleccions sense refer el treball des de zero.',
      'Revisa les versions disponibles d’una selecció, com l’original o els seus refinaments, per comparar alternatives narratives abans de decidir.',
      'Usa el mode «Chat» per demanar nous criteris, ajustar una cerca o refinar la selecció segons el context del muntatge.',
      'Selecciona els clips identificats per KAI que vulguis utilitzar i porta’ls a la línia de temps des del mateix entorn d’edició.',
    ],
  },
]

/** Retorna la guia el slug de la qual coincideix, o undefined si no existeix. */
export function findGuideBySlug(slug: string | undefined): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug)
}
