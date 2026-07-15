/**
 * Traducció al català (ca) del contingut de MainPage.
 * Reflecteix exactament la forma de `mainPage.content.ts`.
 */
export const mainPageContent = {
  hero: {
    titleLead: 'Troba els ',
    titleAccent: 'moments clau',
    titleTail: ' sense revisar hores de metratge',
    lead: 'KAI indexa el teu material en brut, entén les teves cerques amb llenguatge natural i exporta les teves seleccions directament al teu editor. Redueixes l’etiquetatge manual i guanyes temps per decidir, muntar i explicar millor.',
    primaryCta: 'Comprar KAI',
    secondaryCta: 'Provar gratis',
    secondaryCtaHref: '/login?plan=free',
    videoAlt: 'KAI localitzant els moments clau dins d’una línia de temps de vídeo',
    videoPause: 'Pausar la demo',
    videoPlay: 'Reproduir la demo',
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
    lead: 'No necessites revisar hores de material ni etiquetar cada presa a mà. Descriu el que necessites amb llenguatge natural i KAI recorre el contingut indexat per retornar-te els fragments rellevants, a punt per seleccionar, ordenar i muntar.',
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
        body: 'Busca escenes, frases, temes o situacions amb llenguatge natural. KAI analitza el material indexat i localitza els clips rellevants, perquè no hagis de començar de zero.',
      },
      {
        title: 'Construeix la teva playlist',
        body: 'Revisa resultats, arrossega clips, reordena’ls i afina la teva selecció en un espai dissenyat per passar amb rapidesa d’una cerca a una primera estructura narrativa.',
      },
      {
        title: 'Porta-ho al teu editor',
        body: 'Exporta les teves seleccions a l’eina on ja muntes. KAI funciona com a plugin, de manera que la cerca realitzada aquí s’integra directament al teu NLE.',
      },
    ],
  },

  faq: {
    title: 'Preguntes freqüents',
    items: [
      {
        q: 'Què fa KAI exactament?',
        a: 'KAI ajuda els equips de producció i postproducció a gestionar grans volums de material. Primer indexa el contingut en brut, després permet cercar moments amb llenguatge natural i, finalment, exporta les teves seleccions a l’editor perquè continuïs el muntatge.',
      },
      {
        q: 'En què es diferencia d’un gestor d’actius o d’un editor tradicional?',
        a: 'Un gestor d’actius emmagatzema i localitza arxius. Un editor permet muntar. KAI se situa entre tots dos: comprèn el contingut real del material, ajuda a trobar moments narratius concrets i converteix els resultats en seleccions a punt per editar. El teu criteri creatiu es manté intacte; KAI es limita a eliminar la feina més laboriosa abans que decideixis.',
      },
      {
        q: 'Com arriben els clips a l’editor?',
        a: 'KAI s’integra en fluxos d’edició professional mitjançant un plugin i l’exportació de seleccions. Cerques, revises i organitzes clips a KAI, i trasllades aquesta feina directament al teu NLE per continuar el muntatge sense refer la selecció a mà. La forma exacta del traspàs depèn del teu entorn d’edició i es defineix durant la configuració.',
      },
      {
        q: 'Quin tipus de material pot analitzar KAI?',
        a: 'KAI està dissenyat per a material audiovisual en brut, i resulta especialment útil en produccions de gran volum: formats unscripted, realities, entrevistes, documentals, factual entertainment o continguts multicàmera. Els formats, còdecs i volums concrets es revisen producció per producció per garantir un flux estable.',
      },
      {
        q: 'Pot gestionar produccions amb moltes hores de contingut?',
        a: 'Sí. És precisament el problema que KAI va néixer per resoldre. El seu objectiu és reduir el temps dedicat a revisar, cercar i organitzar metratge. La capacitat efectiva en cada cas depèn del volum, la infraestructura i les necessitats de la producció, per la qual cosa acordem el model d’ús més adequat abans de començar.',
      },
      {
        q: 'Què passa amb la privacitat i la seguretat del material?',
        a: 'El material d’una producció és sensible, i KAI està pensat per a entorns professionals on el control d’accés, la traçabilitat i la seguretat són prioritaris. Definim com es processa, s’emmagatzema i s’accedeix al material a cada projecte i cada desplegament. Si la teva producció té requisits específics, l’equip revisa el cas abans d’activar el servei.',
      },
      {
        q: 'Qui hi ha darrere de KAI i com puc començar?',
        a: 'KAI neix a Gestmusic (part de Banijay) i a la iniciativa Amplify, i és un projecte d’innovació europeu amb el suport d’EIT Culture & Creativity i de l’European Institute of Innovation and Technology. Es recolza, a més, en la recerca de Fraunhofer IPK i en un nucli d’IA desenvolupat per Ugiat Technologies. Per començar, consulta els plans o escriu a l’equip per definir una llicència o subscripció que s’ajusti a la teva producció.',
      },
    ],
  },

  cta: {
    title: 'Converteix el teu metratge en una selecció a punt per muntar',
    lead: 'Subscriu-te i comença a buscar als teus vídeos amb llenguatge natural. KAI s’ocupa de la part més laboriosa perquè el teu equip es concentri en l’essencial: seleccionar, ordenar i explicar millor.',
    primaryCta: 'Comprar KAI',
  },
} as const
