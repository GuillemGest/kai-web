/**
 * Traducció al català (ca) del contingut de CompanyPage.
 * Reflecteix exactament la forma de `companyPage.content.ts`.
 */
export const companyPageContent = {

  hero: {
    kicker: 'Sobre KAI',
    titleLead: 'Explica la història. ',
    titleAccent: 'KAI troba el clip.',
    titleTail: '',
    lead: 'KAI neix a Gestmusic (Banijay Entertainment), juntament amb Amplify, per resoldre un repte molt concret de la producció audiovisual: gestionar grans volums de material sense dedicar hores a la revisió manual. Desenvolupem un plugin d’IA que indexa el material en brut, permet cercar moments amb llenguatge natural i trasllada les seleccions al teu flux d’edició.',
  },

  mission: {
    title: 'Del material en brut a la decisió editorial.',
    paragraphs: [
      'A la majoria de produccions, la història no apareix en una línia de temps buida: es troba dispersa entre hores d’entrevistes, càmeres, reaccions, escenes i notes d’equip. Les eines convencionals ajuden a gestionar els arxius o a muntar-los, però entre el material en brut i la peça final encara hi ha una fase lenta de cerca, catalogació i reconstrucció.',
      'Aquest és el buit que KAI resol. Indexa el material, permet explorar-lo amb llenguatge natural i converteix els resultats en seleccions que passen directament a l’editor. El criteri de l’equip es manté intacte; KAI es limita a eliminar la fricció del procés perquè aquestes decisions arribin abans.',
    ],
  },

  partners: {
    title: 'Qui hi ha darrere',
    intro:
      'KAI és una col·laboració europea que reuneix equips de producció, producte, recerca i tecnologia aplicada. Gestmusic i Amplify lideren el desenvolupament del producte, amb el suport d’EIT Culture & Creativity, la recerca de Fraunhofer IPK i la tecnologia d’IA d’Ugiat Technologies.',
    logoAriaLabelTemplate: 'Logo de {name}',
    items: [
      {
        name: 'Gestmusic',
        note: 'Banijay Entertainment',
        role: 'Aporta el context real de producció audiovisual i el saber fer pràctic del qual va sorgir KAI.',
        logoSrc: '/logosProject/gestmusicLogo.png',
      },
      {
        name: 'Amplify',
        note: 'Producte i desenvolupament',
        role: 'Ajuda a construir KAI i a marcar cap on creix com a producte SaaS per a fluxos professionals de media i entreteniment.',
        logoSrc: '/logosProject/Aplify.webp',
      },
      {
        name: 'EIT Culture & Creativity',
        note: 'Projecte europeu d’innovació',
        role: 'Avala el projecte com a part del marc europeu d’innovació que dirigeix l’European Institute of Innovation and Technology.',
        logoSrc: '/logosProject/EIT.png',
      },
      {
        name: 'Fraunhofer IPK',
        note: 'Recerca aplicada',
        role: 'Aporta recerca en comprensió visual avançada que reforça la tecnologia que hi ha darrere de KAI.',
        logoSrc: '/logosProject/IPK.png',
      },
      {
        name: 'Ugiat Technologies',
        note: 'Tecnologia d’IA',
        role: 'Aporta el nucli d’anàlisi d’IA que permet a KAI estructurar i explorar material audiovisual.',
        logoSrc: '/logosProject/ugiat.png',
      },
    ],
  },

  cta: {
    title: 'Veiem com encaixa KAI al teu flux?',
    lead: 'Explica’ns com treballeu, quant material gestioneu i quin editor feu servir. T’ajudem a trobar la configuració de KAI que tingui sentit per a la teva producció.',
    primaryCtaLabelTemplate: 'Escriure a {email}',
  },
} as const
