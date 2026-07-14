/**
 * English (en) translation of ResourcesPage content.
 */
export const resourcesPageContent = {

  head: {
    badge: 'Resource centre',
    title: 'How can we help you?',
    lead: 'Quick answers on installation, account, plans, indexing, natural-language search and exporting clips to your editor.',
    searchPlaceholder: 'Search: install, index, export, plan, NLE…',
    searchAriaLabel: 'Search the resource centre',
  },

  status: {
    loading: 'Loading resources…',
    resultsWithQuerySingularTemplate: '{count} result for «{query}»',
    resultsWithQueryPluralTemplate: '{count} results for «{query}»',
    resultsIdleSingularTemplate: '{count} resource available',
    resultsIdlePluralTemplate: '{count} resources available',
  },

  index: {
    ariaLabel: 'Categories',
    label: 'Categories',
  },

  empty: {
    titleTemplate: 'No results for «{query}»',
    body: 'Try another word, or write to us and we will help with your specific case.',
    clearButton: 'Clear search',
    contactButton: 'Write to support',
  },

  cta: {
    title: 'Need help with your production?',
    lead: 'Tell us about your case and the KAI team will help you find the best setup for your workflow, the volume of material you handle and the editor you use.',
    button: 'Contact support',
  },

  guides: {
    title: 'Step-by-step guides',
    badge: 'Guides',
    // Per-card guide metadata. `{count}` = number.
    meta: {
      stepsTemplate: '{count} steps',
      minutesTemplate: '{count} min',
      moreStepsTemplate: '+{count} more steps',
      open: 'Open guide',
    },
  },
} as const
