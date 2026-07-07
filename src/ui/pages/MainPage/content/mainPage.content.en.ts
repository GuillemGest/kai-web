/**
 * English (en) translation of MainPage content.
 * Mirror the shape of `mainPage.content.ts` exactly.
 */
export const mainPageContent = {
  hero: {
    titleLead: 'Find the ',
    titleAccent: 'key moments',
    titleTail: ' without reviewing hours of footage',
    lead: 'KAI indexes your raw footage, understands your queries in natural language and exports your selections straight into your editor. You spend less time logging by hand and gain more time to decide, cut and tell a better story.',
    primaryCta: 'See plans',
    videoAlt: 'KAI locating key moments inside a video timeline',
    videoPause: 'Pause the demo',
    videoPlay: 'Play the demo',
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
    lead: 'You do not need to scrub through hours of material or tag every take by hand. Describe what you need in natural language and KAI searches the indexed content to return the relevant fragments, ready to pick, order and edit.',
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
        body: 'Search scenes, phrases, topics or situations in natural language. KAI analyses the indexed footage and locates the clips that fit, so you never start from a blank page.',
      },
      {
        title: 'Build your playlist',
        body: 'Review the results, drag clips, reorder them and refine your selection in a space designed to take you quickly from a search to a first narrative structure.',
      },
      {
        title: 'Send it to your editor',
        body: 'Export your selections into the tool you already edit in. KAI runs as a plugin, so the search you carried out here integrates directly into your NLE.',
      },
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'What does KAI do exactly?',
        a: 'KAI helps production and post-production teams manage large volumes of footage. It first indexes the raw content, then lets you search for moments in natural language and finally exports your selections to the editor so you can continue the cut.',
      },
      {
        q: 'How is it different from an asset manager or a traditional editor?',
        a: 'An asset manager stores and locates files. An editor lets you cut. KAI sits between the two: it understands the actual content of the material, helps you find specific narrative moments and turns the results into selections ready to edit. Your creative judgement remains intact; KAI simply removes the more laborious work before you decide.',
      },
      {
        q: 'How do clips reach the editor?',
        a: 'KAI integrates into professional editing workflows through a plugin and selection export. You search, review and organise clips in KAI, then take that work directly into your NLE to continue editing without rebuilding the selection by hand. The exact form of the handoff depends on your editing environment and is defined during setup.',
      },
      {
        q: 'What kind of material can KAI analyse?',
        a: 'KAI is designed for raw audiovisual material and is particularly valuable on high-volume productions: unscripted formats, reality, interviews, documentaries, factual entertainment or multi-camera shoots. Specific formats, codecs and volumes are reviewed production by production to ensure a stable workflow.',
      },
      {
        q: 'Can it handle productions with many hours of content?',
        a: 'Yes. It is precisely the problem KAI was created to solve. Its purpose is to reduce the time spent reviewing, searching and organising footage. The effective capacity in each case depends on your volume, your infrastructure and the needs of the production, so we agree on the most suitable usage model before you start.',
      },
      {
        q: 'What about privacy and security of the material?',
        a: 'A production’s footage is sensitive, and KAI is designed for professional environments where access control, traceability and security are priorities. We define how material is processed, stored and accessed per project and per deployment. If your production has specific requirements, the team reviews the case before activating the service.',
      },
      {
        q: 'Who is behind KAI and how can I get started?',
        a: 'KAI originates at Gestmusic (part of Banijay) and the Amplify initiative, and it is a European innovation project backed by EIT Culture & Creativity and the European Institute of Innovation and Technology. It also draws on research from Fraunhofer IPK and an AI core developed by Ugiat Technologies. To get started, review the plans or contact the team to define a licence or subscription that fits your production.',
      },
    ],
  },

  cta: {
    title: 'Turn your footage into a selection ready to edit',
    lead: 'Subscribe and start searching your videos in natural language. KAI takes on the most laborious work so your team can focus on what matters: selecting, ordering and telling a better story.',
    primaryCta: 'See plans',
  },
} as const
