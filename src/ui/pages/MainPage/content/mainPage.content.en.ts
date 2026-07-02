/**
 * English (en) translation of MainPage content.
 * Mirror the shape of `mainPage.content.ts` exactly.
 */
export const mainPageContent = {
  hero: {
    titleLead: 'Find the ',
    titleAccent: 'key moments',
    titleTail: ' without reviewing hours of footage',
    lead: 'KAI indexes your raw footage, understands natural-language queries and exports your selections straight to your editor. Less manual logging. More time to decide, edit and tell better stories.',
    primaryCta: 'See plans',
    videoAlt: 'KAI locating key moments inside a video timeline',
  },

  trustedBy: {
    title: 'Trusted by leading brands:',
    logos: [
      { src: 'logoCompany/gestmusicLogo.png', alt: 'Gestmusic' },
      { src: 'logoCompany/tv3Logo.png', alt: 'TV3' },
    ],
  },

  compat: {
    // Platform names = brands: not translated. Only the labels.
    osLabel: 'Works on',
    os: ['macOS', 'Windows'],
    integrationLabel: 'Runs inside',
    integrationApp: 'Adobe Premiere Pro',
  },

  demo: {
    title: 'Describe what you are looking for. KAI finds the clips.',
    lead: 'You do not have to go through hours of material or tag every take by hand. Type a query the way you would ask your team and KAI searches the indexed content to return the relevant fragments, ready to pick, order and edit.',
    tag: 'Example search',
    query: 'the interview where they talk about the shoot',
    result: 'KAI finds 4 moments in 3.2 s',
    clips: [
      { time: '00:12', label: 'Talks about the night shoot' },
      { time: '04:03', label: 'Tells an anecdote from the set' },
      { time: '21:47', label: 'Explains how they prepared the role' },
      { time: '08:55', label: 'Sends a message to the crew' },
    ],
  },

  features: {
    heading: 'From hours of footage to a selection ready to edit',
    items: [
      {
        title: 'Find the exact moment',
        body: 'Search for scenes, phrases, topics or situations in natural language. KAI analyses the indexed footage and locates the relevant clips so you do not have to start from scratch.',
      },
      {
        title: 'Build your playlist',
        body: 'Review results, drag clips, reorder them and fine-tune your selection in a space designed to move quickly from search to narrative structure.',
      },
      {
        title: 'Send it to your editor',
        body: 'Export your selections into the workflow where you already edit. KAI works as a plugin and connects the search stage with editing in your NLE.',
      },
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'What does KAI do exactly?',
        a: 'KAI helps production and post-production teams work with large volumes of audiovisual material. First it indexes the raw content, then it lets you search moments in natural language and finally it exports the selections to the editor to continue with the edit.',
      },
      {
        q: 'How is it different from an asset manager or a traditional editor?',
        a: 'An asset manager helps you store and locate files. An editor lets you cut. KAI sits between the two: it understands the content of the material, lets you find specific narrative moments and turns the results into useful selections for editing. It does not replace your creative judgement; it removes the heavy lifting before you make decisions.',
      },
      {
        q: 'How do clips reach the editor?',
        a: 'KAI is designed to integrate into professional editing workflows via plugin and selection export. The idea is that you search, review and organise clips in KAI and take that work directly to your NLE to continue editing without rebuilding the selection by hand. Integration details depend on the editing environment and are set during configuration.',
      },
      {
        q: 'What kind of material can KAI analyse?',
        a: 'KAI is designed to work with raw audiovisual material, especially in high-volume productions such as unscripted formats, reality, interviews, documentaries, factual entertainment or multi-camera content. Specific formats, codecs and volumes are reviewed per production to ensure a stable and compatible workflow.',
      },
      {
        q: 'Can it handle productions with many hours of content?',
        a: 'Yes, KAI was born precisely to solve the problem of working with large amounts of footage. It is designed to reduce the time spent reviewing, searching and organising material. Actual operational capacity depends on volume, infrastructure and the needs of each production, so the best usage model is agreed before starting.',
      },
      {
        q: 'What about privacy and security of the material?',
        a: 'A production’s audiovisual material is sensitive, and KAI is designed for professional environments where access control, traceability and security matter. Processing, storage and access conditions are defined per project and deployment type. For productions with specific requirements, the KAI team reviews the case before activating the service.',
      },
      {
        q: 'Who is behind KAI and how can I get started?',
        a: 'KAI is born at Gestmusic, part of Banijay, within the Amplify initiative and as a European innovation project backed by EIT Culture & Creativity, supported by the European Institute of Innovation and Technology. It also includes research from Fraunhofer IPK and an AI core developed by Ugiat Technologies. To get started, you can review the plans or contact the team to define a licence or subscription tailored to your production.',
      },
    ],
  },

  cta: {
    title: 'Turn your footage into a selection ready to edit',
    lead: 'Subscribe and start searching your videos in natural language. KAI handles the heavy lifting so your team can focus on selecting, ordering and telling better stories.',
    primaryCta: 'See plans',
  },
} as const
