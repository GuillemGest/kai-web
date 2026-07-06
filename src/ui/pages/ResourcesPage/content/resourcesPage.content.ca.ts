/**
 * Traducció al català (ca) del contingut de ResourcesPage.
 */
export const resourcesPageContent = {
  supportEmail: 'soporte@kai.app',

  head: {
    badge: 'Centre de recursos',
    title: 'En què et podem ajudar?',
    lead: 'Troba respostes ràpides sobre instal·lació, compte, plans, indexació, cerca en llenguatge natural i exportació a l’editor.',
    searchPlaceholder: 'Cerca: instal·lar, indexar, exportar, pla, NLE…',
    searchAriaLabel: 'Cercar al centre de recursos',
  },

  status: {
    loading: 'Carregant recursos…',
    resultsWithQuerySingularTemplate: '{count} resultat per «{query}»',
    resultsWithQueryPluralTemplate: '{count} resultats per «{query}»',
    resultsIdleSingularTemplate: '{count} recurs disponible',
    resultsIdlePluralTemplate: '{count} recursos disponibles',
  },

  index: {
    ariaLabel: 'Categories',
    label: 'Categories',
  },

  empty: {
    titleTemplate: 'Sense resultats per «{query}»',
    body: 'Prova amb una altra paraula o escriu-nos i t’ajudem amb el teu cas concret.',
    clearButton: 'Netejar cerca',
    contactButton: 'Escriure a suport',
  },

  cta: {
    title: 'Necessites ajuda amb la teva producció?',
    lead: 'Explica’ns el teu cas i l’equip de KAI t’ajudarà a revisar la millor configuració per al teu flux de treball, el teu volum de material i el teu editor.',
    button: 'Contactar amb suport',
  },

  guides: {
    title: 'Guies pas a pas',
    badge: 'Guies',
    // Metadades de cada targeta de guia. `{count}` = número.
    meta: {
      stepsTemplate: '{count} passos',
      minutesTemplate: '{count} min',
      moreStepsTemplate: '+{count} passos més',
      open: 'Obrir guia',
    },
  },
} as const
