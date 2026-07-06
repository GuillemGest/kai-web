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
    body: 'KAI is an AI plugin for audiovisual production and post-production teams. It indexes raw footage, lets you search moments in natural language and helps turn those selections into material ready to keep editing.',
    category: 'First steps',
  },
  'basic-workflow': {
    title: 'What is the basic workflow with KAI?',
    body: 'The general flow is: upload or connect the material, index it, search moments in your own words, review the results and export the selection to the editor. KAI is designed to reduce manual review time without taking control away from the creative team.',
    category: 'First steps',
  },
  'who-uses-kai': {
    title: 'Who is KAI for?',
    body: 'KAI is designed for teams that work with many hours of video: production, post-production, story editors, directors, editors, assistant editors and content leads. It is especially useful when finding the exact moment takes too long.',
    category: 'First steps',
  },
  'login-required': {
    title: 'Do I need to sign in to use KAI?',
    body: 'Yes. To manage your plan and access available resources, you need an active account on the KAI website. Access may depend on the plan, licence or setup agreed for your production.',
    category: 'First steps',
  },
  'check-compatibility': {
    title: 'How do I know if my environment is compatible?',
    body: 'Compatibility depends on the editor, project setup and deployment type. Before activating KAI in a professional environment, review the requirements shown in your account or check with the support team.',
    category: 'Installation and requirements',
  },
  'supported-formats': {
    title: 'What file formats can I use with KAI?',
    body: 'KAI is designed to work with professional audiovisual material, but specific formats, codecs and configurations must be validated per production. If you have a specific technical workflow, check compatibility before indexing large volumes of material.',
    category: 'Installation and requirements',
  },
  'access-account': {
    title: 'How do I access my account?',
    body: 'Sign in on the KAI website with the email linked to your account or your team. From there you can review your access, your plan and the options available for your production.',
    category: 'Account and plans',
  },
  'change-plan': {
    title: 'Can I change my plan?',
    body: 'Yes, plans are designed to adapt to different types of use and production. Options to change, upgrade or adjust depend on your current subscription and the conditions linked to your account.',
    category: 'Account and plans',
  },
  'more-capacity': {
    title: 'What do I do if I need more capacity for a production?',
    body: 'If you are going to work with more hours of material, more users or specific technical needs, contact the KAI team. The case can be reviewed to adapt the licence or configuration to the actual pace of your production.',
    category: 'Account and plans',
  },
  'billing-info': {
    title: 'Where can I check my invoices and billing details?',
    body: 'Billing details and plan information are managed from your account, when this option is available. If you cannot find an invoice or need to change administrative data, contact support.',
    category: 'Account and plans',
  },
  'what-is-indexing': {
    title: 'What does indexing material mean?',
    body: 'Indexing means analysing the content to turn it into searchable information. KAI can use data such as transcriptions, tags and material context so that you can then find specific moments in natural language.',
    category: 'Search and indexing',
  },
  'indexing-time': {
    title: 'How long does indexing take?',
    body: 'Indexing time depends on the volume of material, the length of the clips, the type of analysis and the project’s technical setup. On high-volume productions, performance is reviewed before defining the workflow.',
    category: 'Search and indexing',
  },
  'natural-language-search': {
    title: 'How do I run a natural-language search?',
    body: 'Type what you need the way you would ask another person on the team: a phrase, a situation, a topic, a reaction or a specific statement. The clearer the context, the easier it is to review useful results.',
    category: 'Search and indexing',
  },
  'reuse-searches': {
    title: 'Can I save or reuse a search?',
    body: 'KAI is designed to work with sessions and conversations that can be reopened and reused inside the project. This helps keep context, avoid repeated searches and share findings with the team.',
    category: 'Search and indexing',
  },
  'review-results': {
    title: 'Can I review results before exporting?',
    body: 'Yes. The idea is that you can review the clips found, check whether they fit the search and adjust the selection before taking it to the editor. KAI is designed to support the editorial decision, not to skip it.',
    category: 'Plugin use and NLE integration',
  },
  'order-clips': {
    title: 'Can I order the clips before exporting them?',
    body: 'Yes. KAI supports working with selections and playlists to organise clips before sending them into the editing workflow. This helps move from a loose search to a clearer narrative structure.',
    category: 'Plugin use and NLE integration',
  },
  'nle-integration': {
    title: 'Which editors does KAI integrate with?',
    body: 'KAI targets professional non-linear editing workflows. Its initial integration focuses on Adobe Premiere Pro via a native panel, currently the only natively supported NLE environment. This is, however, just the first step of an expanding integration roadmap: the number of compatible editors will grow progressively, adding new NLE environments based on teams’ needs and the evolution of each workflow, with compatibility and export method tailored to each one.',
    category: 'Plugin use and NLE integration',
  },
  'what-exports-to-nle': {
    title: 'What is exported to the editor?',
    body: 'KAI exports selections, structures or playlists prepared from the clips found so the team can continue the edit in their editor. Format and compatibility details depend on the configuration available for each environment.',
    category: 'Plugin use and NLE integration',
  },
  'processing-location': {
    title: 'Where is my material processed?',
    body: 'Processing may vary depending on the plan, infrastructure and needs of the production. KAI covers cloud workflows and setups adapted to professional environments, so the specific model is defined before activating the service.',
    category: 'Privacy, security and support',
  },
  'content-access': {
    title: 'Who can access my production material?',
    body: 'Access to material must be limited to authorised users and teams within the project. On productions with specific control, permission or confidentiality requirements, review the setup with the KAI team before starting.',
    category: 'Privacy, security and support',
  },
  'slow-performance': {
    title: 'What do I do if KAI is slow or takes long to respond?',
    body: 'Performance can be affected by the volume of material, indexing state, connection, infrastructure or search type. First check that the material is indexed and, if the issue continues, contact support noting the project and the observed behaviour.',
    category: 'Privacy, security and support',
  },
  'contact-support': {
    title: 'How do I contact support?',
    body: 'You can contact the KAI team from the support or contact button on the website. To help you faster, include a description of the issue, the affected project, the editor you are using and any available error message.',
    category: 'Privacy, security and support',
  },
}
