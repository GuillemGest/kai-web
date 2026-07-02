/**
 * Traducció al català (ca) del contingut de CompanyPage.
 * Reflecteix exactament la forma de `companyPage.content.ts`.
 */
export const companyPageContent = {
  contactEmail: 'hola@kai.app',

  hero: {
    kicker: 'Sobre KAI',
    titleLead: 'Explica la història. ',
    titleAccent: 'KAI troba el clip.',
    titleTail: '',
    lead: 'KAI neix a Gestmusic (Banijay Entertainment), juntament amb Amplify, per resoldre un problema molt concret de la producció audiovisual: treballar amb grans volums de material sense perdre hores en revisió manual. Construïm un plugin d’IA que indexa el brut, permet buscar moments en llenguatge natural i porta les seleccions al flux d’edició.',
  },

  mission: {
    title: 'Del material en brut a la decisió editorial.',
    paragraphs: [
      'En moltes produccions, la història no apareix en una línia de temps buida: està amagada entre hores d’entrevistes, càmeres, reaccions, escenes i notes d’equip. Les eines tradicionals ajuden a gestionar arxius o a editar, però entre el brut i el muntatge encara hi ha una fase lenta de cerca, catalogació i reconstrucció.',
      'KAI està dissenyat per cobrir aquest espai. Indexa el material, permet explorar-lo amb les teves pròpies paraules i converteix els resultats en seleccions a punt per continuar a l’editor. L’objectiu no és substituir el criteri de l’equip, sinó treure fricció perquè arribi abans a les decisions que importen.',
    ],
  },

  partners: {
    title: 'Qui hi ha darrere',
    intro:
      'KAI és una col·laboració europea entre equips de producció, producte, recerca i tecnologia aplicada. Gestmusic i Amplify impulsen el desenvolupament del producte, amb el suport d’EIT Culture & Creativity, la recerca de Fraunhofer IPK i tecnologia d’IA d’Ugiat Technologies.',
    logoAriaLabelTemplate: 'Logo de {name}',
    items: [
      {
        name: 'Gestmusic',
        note: 'Banijay Entertainment',
        role: 'Aporta el context real de producció audiovisual i el coneixement operatiu des del qual neix KAI.',
        logoSrc: '/logosProject/gestmusicLogo.png',
      },
      {
        name: 'Amplify',
        note: 'Producte i desenvolupament',
        role: 'Participa en el desenvolupament de KAI i en la seva evolució com a solució SaaS per a fluxos professionals de media i entreteniment.',
        logoSrc: '/logosProject/Aplify.webp',
      },
      {
        name: 'EIT Culture & Creativity',
        note: 'Projecte europeu d’innovació',
        role: 'Avala el projecte dins del marc europeu d’innovació impulsat per l’European Institute of Innovation and Technology.',
        logoSrc: '/logosProject/EIT.png',
      },
      {
        name: 'Fraunhofer IPK',
        note: 'Recerca aplicada',
        role: 'Contribueix amb recerca en comprensió visual avançada per enriquir la base tecnològica de KAI.',
        logoSrc: '/logosProject/IPK.png',
      },
      {
        name: 'Ugiat Technologies',
        note: 'Tecnologia d’IA',
        role: 'Aporta un nucli d’anàlisi d’intel·ligència artificial que reforça la capacitat de KAI per estructurar i explorar material audiovisual.',
        logoSrc: '/logosProject/ugiat.png',
      },
    ],
  },

  cta: {
    title: 'Veiem com encaixa KAI al teu flux?',
    lead: 'Explica’ns com treballeu, amb quin volum de material i en quin entorn d’edició. T’ajudarem a valorar la configuració de KAI que tingui sentit per a la teva producció.',
    primaryCtaLabelTemplate: 'Escriure a {email}',
  },
} as const
