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
      'Un recorregut per la interfície de Story Builder: converses, el camp «Ask KAI», la playlist, les targetes de clips, el botó «Refine» i l’exportació mitjançant «Export» amb opcions EDL, XML i OTIO.',
    steps: [
      'Obre Story Builder i crea una conversa nova, o recupera’n una que ja tinguis al projecte.',
      'Escriu la teva cerca al camp «Ask KAI» amb llenguatge natural. Pots demanar una situació, un tema, una intervenció concreta o un moment narratiu en particular.',
      'Revisa la resposta de KAI i la playlist de clips resultant. Comprova el vídeo, els timecodes i el resum de la selecció abans de continuar.',
      'Ajusta la selecció des de les targetes de clips: revisa les descripcions, elimina el que no encaixi i reordena els fragments per construir la seqüència desitjada.',
      'Utilitza «Refine» per afinar la cerca sense perdre el context de la conversa.',
      'Quan la selecció estigui a punt, fes servir «Export» i tria una de les opcions disponibles —EDL, XML o OTIO—, segons la configuració del teu flux d’edició.',
      'Trasllada la selecció exportada al teu editor i continua el muntatge.',
    ],
  },
  {
    slug: 'premiere-panel',
    title: 'Treballar amb KAI des del panell d’Adobe Premiere Pro',
    intro:
      'El panell de KAI per a Adobe Premiere Pro s’integra al teu flux d’edició. Des d’ell accedeixes a les converses del projecte, a les seves versions de selecció i a un chat integrat, i insereixes els clips que KAI ha trobat directament a la línia de temps.',
    steps: [
      'Amb el panell de KAI ja configurat a Adobe Premiere Pro, obre les converses del projecte des de la barra lateral del panell.',
      'Selecciona una conversa o una playlist creada prèviament per reutilitzar aquestes cerques i seleccions en lloc de començar de zero.',
      'Compara les versions d’una selecció —l’original i els seus refinaments— per valorar diferents opcions narratives abans de decidir.',
      'Canvia al mode «Chat» per sol·licitar nous criteris, ajustar una cerca o refinar la selecció segons el muntatge en curs.',
      'Selecciona els clips que KAI ha trobat i insereix-los a la línia de temps des del mateix entorn d’edició.',
    ],
  },
]

/** Retorna la guia el slug de la qual coincideix, o undefined si no existeix. */
export function findGuideBySlug(slug: string | undefined): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug)
}
