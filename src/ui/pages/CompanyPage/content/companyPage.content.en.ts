/**
 * English (en) translation of CompanyPage content.
 * Mirror the shape of `companyPage.content.ts` exactly.
 */
export const companyPageContent = {
  contactEmail: 'hola@kai.app',

  hero: {
    kicker: 'About KAI',
    titleLead: 'Tell the story. ',
    titleAccent: 'KAI finds the clip.',
    titleTail: '',
    lead: 'KAI is born at Gestmusic (Banijay Entertainment), together with Amplify, to solve a very specific problem in audiovisual production: working with large volumes of material without spending hours on manual review. We build an AI plugin that indexes raw footage, lets you search moments in natural language and takes the selections to the editing workflow.',
  },

  mission: {
    title: 'From raw footage to the editorial decision.',
    paragraphs: [
      'In many productions, the story does not appear on an empty timeline: it is hidden between hours of interviews, cameras, reactions, scenes and crew notes. Traditional tools help manage files or edit them, but between the raw material and the finished cut there is still a slow phase of searching, logging and reconstruction.',
      'KAI is designed to cover that gap. It indexes the material, lets you explore it in your own words and turns the results into selections ready to continue in the editor. The goal is not to replace the team’s judgement but to remove friction so it reaches the decisions that matter sooner.',
    ],
  },

  partners: {
    title: 'Who is behind it',
    intro:
      'KAI is a European collaboration between production, product, research and applied-technology teams. Gestmusic and Amplify drive the development of the product, with the support of EIT Culture & Creativity, the research of Fraunhofer IPK and AI technology from Ugiat Technologies.',
    logoAriaLabelTemplate: '{name} logo',
    items: [
      {
        name: 'Gestmusic',
        note: 'Banijay Entertainment',
        role: 'Brings the real production context and the operational knowledge from which KAI is born.',
        logoSrc: '/logosProject/gestmusicLogo.png',
      },
      {
        name: 'Amplify',
        note: 'Product and development',
        role: 'Takes part in the development of KAI and in its evolution as a SaaS solution for professional media and entertainment workflows.',
        logoSrc: '/logosProject/Aplify.webp',
      },
      {
        name: 'EIT Culture & Creativity',
        note: 'European innovation project',
        role: 'Backs the project within the European innovation framework driven by the European Institute of Innovation and Technology.',
        logoSrc: '/logosProject/EIT.png',
      },
      {
        name: 'Fraunhofer IPK',
        note: 'Applied research',
        role: 'Contributes with research on advanced visual understanding to enrich the technology base of KAI.',
        logoSrc: '/logosProject/IPK.png',
      },
      {
        name: 'Ugiat Technologies',
        note: 'AI technology',
        role: 'Brings an AI analysis core that strengthens KAI’s ability to structure and explore audiovisual material.',
        logoSrc: '/logosProject/ugiat.png',
      },
    ],
  },

  cta: {
    title: 'Shall we see how KAI fits your workflow?',
    lead: 'Tell us how you work, the volume of material you handle and the editing environment you use. We will help you assess the KAI setup that makes sense for your production.',
    primaryCtaLabelTemplate: 'Write to {email}',
  },
} as const
