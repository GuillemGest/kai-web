/**
 * English (en) translation of ShopPage content.
 */
export const shopPageContent = {
  planCard: {
    popularBadge: 'Most popular',
    pricePeriodMonth: '/mo',
    pricePeriodYear: '/yr',
    priceFromPrefix: 'from',
    customPriceLabel: 'Custom',
    freePriceLabel: 'Free',
    customCtaLabel: 'Request a quote',
    freeCtaLabel: 'Start for free',
    selectCtaTemplate: 'Choose {name}',
    discountBadgeTemplate: 'Save {percent}%',
  },

  billingToggle: {
    label: 'Billing period',
    monthly: 'Monthly',
    yearly: 'Yearly',
    savingsHint: 'Save {percent}%',
  },

  yearlyDiscountPercent: 20,

  head: {
    title: 'Plans tailored to each project',
    lead: 'KAI pairs recurring cloud subscriptions for individuals and teams with per-production licences for enterprise work. Start on a cloud plan and move up to KAI Enterprise when a production asks for it.',
    notice: 'Pricing model v1. Indicative prices that we will continue to refine based on market feedback.',
  },

  // Free trial: highlighted chip in the header. Sends the visitor to login
  // carrying the free plan (?plan=free); after signing in the trial-started
  // notice shows in /cuenta. Always visible, signed in or not.
  freeTrial: {
    label: 'Free trial',
    hint: '15 days · no card',
    href: '/login?plan=free',
  },

  // KAI Enterprise: discreet presence below the grid for anyone who does not
  // fit a fixed plan. Routes to sales by email (per-production quote).
  enterpriseContact: {
    label: 'KAI Enterprise',
    text: 'None of these plans fit your production? We quote a tailored enterprise licence.',
    ctaLabel: 'Talk to sales',
    email: 'ventas@kai.app',
    emailSubject: 'KAI Enterprise enquiry',
  },

  error: {
    message: 'We could not load the plans.',
    retry: 'Retry',
  },

  empty: {
    message: 'No plans available yet.',
    hint: 'Write to us and we will point you to the options that best fit your production.',
    linkLabel: 'Talk to us',
    linkHref: '/recursos',
  },

  reassurance: [
    { iconName: 'CreditCard', text: 'Recurring cloud subscription for Pro/Solo and Team' },
    { iconName: 'ShieldCheck', text: 'Tailored security and compliance on KAI Enterprise' },
    { iconName: 'Headset', text: 'Support adapted to each production' },
  ] as const,

  comparison: {
    title: 'Compare KAI tiers',
    lead: 'From a single cloud subscription to a per-production enterprise licence. Each tier matches the scale, the volume of footage and the demands of the work.',
    planColumns: ['KAI Audio Analysis', 'KAI Full', 'KAI Team'],
    a11y: { included: 'Included', notIncluded: 'Not included' },
    sections: [
      {
        title: 'Model and deployment',
        rows: [
          { label: 'Model', values: ['Cloud subscription', 'Cloud subscription', 'Cloud subscription'] },
          { label: 'Cloud resources', values: ['Shared', 'Shared', 'Dedicated'] },
          { label: 'On-premise deployment', values: [false, false, false] },
          { label: 'Reference price', values: ['€59/mo', '€149/mo', '€299/mo'] },
        ],
      },
      {
        title: 'Capacity and engines',
        rows: [
          { label: 'Reference capacity', values: ['250 GB · 100 h', '250 GB · 100 h', '1 TB · 1,000 h'] },
          { label: 'Video uploads', values: [true, true, true] },
          { label: 'Audio engine', values: [true, true, true] },
          { label: 'Video and advanced AI', values: [false, true, true] },
          { label: 'Export to the editor', values: [true, true, true] },
          { label: 'Collaborative work', values: [false, false, true] },
          { label: 'Tailored security / compliance', values: [false, false, false] },
          { label: 'Operational continuity', values: [false, false, false] },
        ],
      },
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'What is the difference between KAI Audio Analysis and KAI Full?',
        a: 'Both are entry cloud plans with a 250 GB or 100 h reference. KAI Audio Analysis (from €59/mo) is oriented towards audio-focused models, while KAI Full (from €149/mo) enables every engine: audio, video and advanced AI.',
      },
      {
        q: 'Who is KAI Team for?',
        a: 'For small and mid-sized teams that need more capacity and reliability. It is a per-team cloud plan (€299/mo reference) with 1 TB or 1,000 h and dedicated cloud resources, to maintain steady and predictable performance.',
      },
      {
        q: 'How is KAI Enterprise priced?',
        a: 'KAI Enterprise has no fixed rate: it is quoted per production. The price depends on the number of cameras or signals, the shooting days, the ingest volume, the features and integrations required, the level of support and any deployment constraints.',
      },
      // Question temporarily disabled (pending business decision on pricing v1).
      // {
      //   q: 'Is the pricing final?',
      //   a: 'It is a pricing model v1. The pricing policy will keep being refined with market feedback to stay flexible and competitive across client profiles and geographies.',
      // },
    ],
  },
} as const

export type ShopReassuranceIcon = (typeof shopPageContent.reassurance)[number]['iconName']
