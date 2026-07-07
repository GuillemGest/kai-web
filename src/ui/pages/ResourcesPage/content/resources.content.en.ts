/**
 * English (en) translations of the resource-centre items.
 * `id` values are stable and match the InMemoryResourceRepository.
 */
export const resourceTranslations: Record<
  string,
  { title: string; body: string; category: string }
> = {
  'what-is-kai': {
    title: 'What is KAI?',
    body: 'KAI is an AI plugin for audiovisual production and post-production teams. It indexes raw footage, lets you search for moments in natural language and turns those selections into material ready to keep editing.',
    category: 'First steps',
  },
  'basic-workflow': {
    title: 'What is the basic workflow with KAI?',
    body: 'The general flow is: upload or connect your material, index it, search for moments in natural language, review the results and export the selection to your editor. The goal is to reduce the time spent on manual review while the creative team remains in charge.',
    category: 'First steps',
  },
  'who-uses-kai': {
    title: 'Who is KAI for?',
    body: 'Anyone working with large volumes of video: production and post-production teams, story editors, directors, editors, assistant editors and content leads. It is particularly useful when finding the exact moment takes up too much time.',
    category: 'First steps',
  },
  'login-required': {
    title: 'Do I need to sign in to use KAI?',
    body: 'Yes. You need an active account on the KAI website to manage your plan and access the available resources. Access may depend on the plan, licence or configuration agreed for your production.',
    category: 'First steps',
  },
  'check-compatibility': {
    title: 'How do I know if my environment is compatible?',
    body: 'It depends on your editor, how the project is configured and the type of deployment. Before activating KAI in a professional environment, review the requirements listed in your account or consult the support team.',
    category: 'Installation and requirements',
  },
  'supported-formats': {
    title: 'What file formats can I use with KAI?',
    body: 'KAI works with professional audiovisual material, but the specific formats, codecs and configurations must be validated production by production. If you use a particular technical workflow, confirm compatibility before indexing large volumes of material.',
    category: 'Installation and requirements',
  },
  'access-account': {
    title: 'How do I access my account?',
    body: 'Sign in on the KAI website with the email associated with your account or your team. From there you can review your access, your plan and the options available for your production.',
    category: 'Account and plans',
  },
  'change-plan': {
    title: 'Can I change my plan?',
    body: 'Yes. Plans are designed to adapt to different types of use and production. The options to switch, upgrade or adjust depend on your current subscription and the terms associated with your account.',
    category: 'Account and plans',
  },
  'more-capacity': {
    title: 'What do I do if I need more capacity for a production?',
    body: 'If you are going to work with more hours of material, more users or specific technical needs, contact the KAI team. We can review the case and adapt the licence or configuration to the real pace of your production.',
    category: 'Account and plans',
  },
  'billing-info': {
    title: 'Where can I check my invoices and billing details?',
    body: 'You manage billing details and plan information from your account, where that option is available. If an invoice is missing or you need to change administrative data, contact support.',
    category: 'Account and plans',
  },
  'what-is-indexing': {
    title: 'What does indexing material mean?',
    body: 'Indexing means analysing your content to turn it into searchable information. KAI draws on elements such as transcriptions, tags and the context of the material so that you can later locate specific moments in natural language.',
    category: 'Search and indexing',
  },
  'indexing-time': {
    title: 'How long does indexing take?',
    body: 'It depends on the volume of material, the length of the clips, the type of analysis and the project’s technical setup. On high-volume productions, performance is reviewed before defining the workflow.',
    category: 'Search and indexing',
  },
  'natural-language-search': {
    title: 'How do I run a natural-language search?',
    body: 'Describe what you are looking for the way you would ask another member of the team: a phrase, a situation, a topic, a reaction or a specific line. The more context you provide, the easier it is to obtain useful results.',
    category: 'Search and indexing',
  },
  'reuse-searches': {
    title: 'Can I save or reuse a search?',
    body: 'Yes. KAI works with sessions and conversations you can reopen and reuse within the project, which helps maintain context, avoid repeated searches and share findings with the team.',
    category: 'Search and indexing',
  },
  'review-results': {
    title: 'Can I review results before exporting?',
    body: 'Yes. You can review the clips found, check whether they match what you searched for and refine the selection before it reaches the editor. KAI is designed to support your editorial decision, not to replace it.',
    category: 'Plugin use and NLE integration',
  },
  'order-clips': {
    title: 'Can I order the clips before exporting them?',
    body: 'Yes. KAI lets you work with selections and playlists to organise clips before they enter the editing workflow, which helps you move from a scattered search to a clearer narrative structure.',
    category: 'Plugin use and NLE integration',
  },
  'nle-integration': {
    title: 'Which editors does KAI integrate with?',
    body: 'KAI is oriented towards professional non-linear editing. It currently integrates with Adobe Premiere Pro through a native panel, the only NLE environment supported natively so far. This is, however, only the starting point: we will progressively add editors over time, based on teams’ needs and the evolution of each workflow, with the compatibility and export method adapted to each one.',
    category: 'Plugin use and NLE integration',
  },
  'what-exports-to-nle': {
    title: 'What is exported to the editor?',
    body: 'KAI exports the selections, structures or playlists prepared from the clips found so the team can continue the edit in their own editor. The exact format and compatibility depend on the configuration available in each environment.',
    category: 'Plugin use and NLE integration',
  },
  'processing-location': {
    title: 'Where is my material processed?',
    body: 'It depends on the plan, the infrastructure and the needs of the production. KAI supports cloud workflows and configurations adapted to professional environments, so we define the specific model with you before activating the service.',
    category: 'Privacy, security and support',
  },
  'content-access': {
    title: 'Who can access my production material?',
    body: 'Access to the material must be limited to the authorised users and teams on the project. If your production has specific control, permission or confidentiality requirements, review the configuration with the KAI team before starting.',
    category: 'Privacy, security and support',
  },
  'slow-performance': {
    title: 'What do I do if KAI is slow or takes long to respond?',
    body: 'Performance may be affected by the volume of material, the state of indexing, the connection, the infrastructure or the type of search. First confirm that the material is indexed, and if the problem persists, contact support indicating the project and the observed behaviour.',
    category: 'Privacy, security and support',
  },
  'contact-support': {
    title: 'How do I contact support?',
    body: 'You can contact the KAI team through the support or contact button on the website. To speed up assistance, let us know the issue, which project it affects, the editor you use and any available error message.',
    category: 'Privacy, security and support',
  },
}
