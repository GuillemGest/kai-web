/**
 * English (en) translation of CompanyPage content.
 * Mirror the shape of `companyPage.content.ts` exactly.
 */
export const companyPageContent = {

  hero: {
    kicker: 'About KAI',
    titleLead: 'Tell the story. ',
    titleAccent: 'KAI finds the clip.',
    titleTail: '',
    lead: 'KAI originates at Gestmusic (Banijay Entertainment), together with Amplify, to solve a very specific challenge in audiovisual production: managing large volumes of material without spending hours on manual review. We develop an AI plugin that indexes raw footage, lets you search moments in natural language and carries the selections into your editing workflow.',
  },

  mission: {
    title: 'From raw footage to the editorial decision.',
    paragraphs: [
      'On most productions the story does not appear on an empty timeline: it is buried in hours of interviews, cameras, reactions, scenes and crew notes. Conventional tools help you manage the files or cut them, but between the raw material and the finished piece there is still a slow phase of searching, logging and reconstruction.',
      'That is the gap KAI closes. It indexes the material, lets you explore it in natural language and turns the results into selections that pass directly to the editor. The team’s judgement remains intact; KAI simply removes the friction from the process so that those decisions arrive sooner.',
    ],
  },

  partners: {
    title: 'Who is behind it',
    intro:
      'KAI is a European collaboration that brings together production, product, research and applied-technology teams. Gestmusic and Amplify lead the development of the product, backed by EIT Culture & Creativity, research from Fraunhofer IPK and AI technology from Ugiat Technologies.',
    logoAriaLabelTemplate: '{name} logo',
    items: [
      {
        name: 'Gestmusic',
        note: 'Banijay Entertainment',
        role: 'Provides the real production context and the practical expertise from which KAI emerged.',
        logoSrc: '/logosProject/gestmusicLogo.png',
      },
      {
        name: 'Amplify',
        note: 'Product and development',
        role: 'Takes part in the development of KAI and its evolution as a SaaS product for professional media and entertainment workflows.',
        logoSrc: '/logosProject/Aplify.webp',
      },
      {
        name: 'EIT Culture & Creativity',
        note: 'European innovation project',
        role: 'Backs the project as part of the European innovation framework run by the European Institute of Innovation and Technology.',
        logoSrc: '/logosProject/EIT.png',
      },
      {
        name: 'Fraunhofer IPK',
        note: 'Applied research',
        role: 'Contributes research on advanced visual understanding that strengthens the technology behind KAI.',
        logoSrc: '/logosProject/IPK.png',
      },
      {
        name: 'Ugiat Technologies',
        note: 'AI technology',
        role: 'Provides the AI analysis core that lets KAI structure and explore audiovisual material.',
        logoSrc: '/logosProject/ugiat.png',
      },
    ],
  },

  cta: {
    title: 'Would you like to see how KAI fits your workflow?',
    lead: 'Tell us how you work, the volume of material you handle and which editor you use. We will help you find the KAI setup that makes sense for your production.',
    primaryCtaLabelTemplate: 'Write to {email}',
  },
} as const
