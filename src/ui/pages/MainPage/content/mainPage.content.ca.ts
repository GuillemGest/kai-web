/**
 * Traducció al català (ca) del contingut de MainPage.
 * Reflecteix exactament la forma de `mainPage.content.ts`.
 */
export const mainPageContent = {
  hero: {
    titleLead: 'Troba els ',
    titleAccent: 'moments clau',
    titleTail: ' sense revisar hores de metratge',
    lead: 'KAI indexa el teu material en brut, entén cerques en llenguatge natural i exporta les teves seleccions directament al teu editor. Menys logging manual. Més temps per decidir, muntar i explicar millor.',
    primaryCta: 'Veure plans',
    videoAlt: 'KAI localitzant els moments clau dins d’una línia de temps de vídeo',
  },

  trustedBy: {
    title: 'Marques líders confien en nosaltres:',
    logos: [
      { src: '/logoCompany/gestmusicLogo.png', alt: 'Gestmusic' },
      { src: '/logoCompany/tv3Logo.png', alt: 'TV3' },
    ],
  },

  compat: {
    // Noms de plataforma = marques: no es tradueixen. Només les etiquetes.
    osLabel: 'Compatible amb',
    os: ['macOS', 'Windows'],
    integrationLabel: 'S’integra a',
    integrationApp: 'Adobe Premiere Pro',
  },

  demo: {
    title: 'Descriu el que busques. KAI troba els clips.',
    lead: 'No has de revisar hores de material ni etiquetar cada presa a mà. Escriu una cerca com la demanaries al teu equip i KAI recorre el contingut indexat per tornar-te els fragments rellevants, a punt per seleccionar, ordenar i muntar.',
    tag: 'Cerca d’exemple',
    query: 'l’entrevista on parla del rodatge',
    result: 'KAI troba 4 moments en 3,2 s',
    clips: [
      { time: '00:12', label: 'Parla del rodatge nocturn' },
      { time: '04:03', label: 'Explica una anècdota del set' },
      { time: '21:47', label: 'Explica com va preparar el paper' },
      { time: '08:55', label: 'Dedica un missatge a l’equip' },
    ],
  },

  features: {
    heading: 'D’hores de material a una selecció a punt per muntar',
    items: [
      {
        title: 'Troba el moment exacte',
        body: 'Busca escenes, frases, temes o situacions en llenguatge natural. KAI analitza el material indexat i localitza els clips rellevants perquè no hagis de començar de zero.',
      },
      {
        title: 'Construeix la teva playlist',
        body: 'Revisa resultats, arrossega clips, canvia l’ordre i ajusta la teva selecció en un espai pensat per passar ràpidament de la cerca a l’estructura narrativa.',
      },
      {
        title: 'Porta-ho al teu editor',
        body: 'Exporta les teves seleccions al flux de treball on ja muntes. KAI funciona com a plugin i connecta el treball de cerca amb l’edició al teu NLE.',
      },
    ],
  },

  faq: {
    title: 'Preguntes freqüents',
    items: [
      {
        q: 'Què fa KAI exactament?',
        a: 'KAI ajuda els equips de producció i postproducció a treballar amb grans volums de material audiovisual. Primer indexa el contingut en brut, després permet buscar moments en llenguatge natural i, finalment, exporta les seleccions a l’editor per continuar treballant en el muntatge.',
      },
      {
        q: 'En què es diferencia d’un gestor d’actius o d’un editor tradicional?',
        a: 'Un gestor d’actius t’ajuda a emmagatzemar i localitzar arxius. Un editor et permet muntar. KAI se situa entre tots dos: entén el contingut del material, permet trobar moments narratius concrets i converteix els resultats en seleccions útils per a l’edició. No substitueix el teu criteri creatiu; redueix la feina pesada abans de prendre decisions.',
      },
      {
        q: 'Com arriben els clips a l’editor?',
        a: 'KAI està pensat per integrar-se en fluxos d’edició professional mitjançant plugin i exportació de seleccions. La idea és que puguis buscar, revisar i organitzar clips a KAI, i portar aquest treball directament al teu NLE per continuar el muntatge sense refer la selecció a mà. Els detalls d’integració depenen de l’entorn d’edició i es concreten durant la configuració.',
      },
      {
        q: 'Quin tipus de material pot analitzar KAI?',
        a: 'KAI està dissenyat per treballar amb material audiovisual en brut, especialment en produccions amb molt volum de vídeo, com formats unscripted, realities, entrevistes, documentals, factual entertainment o continguts multicàmera. Els formats, còdecs i volums concrets es revisen segons cada producció per assegurar un flux estable i compatible.',
      },
      {
        q: 'Pot gestionar produccions amb moltes hores de contingut?',
        a: 'Sí, KAI neix precisament per resoldre el problema de treballar amb grans quantitats de metratge. Està pensat per reduir el temps dedicat a revisar, buscar i organitzar material. La capacitat operativa final depèn del volum, la infraestructura i les necessitats de cada producció, per això es defineix el millor model d’ús abans de començar.',
      },
      {
        q: 'Què passa amb la privacitat i la seguretat del material?',
        a: 'El material audiovisual d’una producció és sensible, i KAI està pensat per a entorns professionals on el control d’accés, la traçabilitat i la seguretat són importants. Les condicions de processament, emmagatzematge i accés es defineixen segons el projecte i el tipus de desplegament. Per a produccions amb requisits específics, l’equip de KAI revisa el cas abans d’activar el servei.',
      },
      {
        q: 'Qui hi ha darrere de KAI i com puc començar?',
        a: 'KAI neix a Gestmusic, part de Banijay, dins de la iniciativa Amplify i com a projecte d’innovació europeu amb el suport d’EIT Culture & Creativity, avalat per l’European Institute of Innovation and Technology. Compta a més amb recerca de Fraunhofer IPK i un nucli d’IA desenvolupat per Ugiat Technologies. Per començar, pots revisar els plans o contactar amb l’equip per definir una llicència o subscripció adaptada a la teva producció.',
      },
    ],
  },

  cta: {
    title: 'Converteix el teu metratge en una selecció a punt per muntar',
    lead: 'Subscriu-te i comença a buscar als teus vídeos amb llenguatge natural. KAI s’encarrega de la feina pesada perquè el teu equip pugui centrar-se a seleccionar, ordenar i explicar millor.',
    primaryCta: 'Veure plans',
  },
} as const
