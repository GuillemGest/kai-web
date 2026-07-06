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
    customCtaLabel: 'Request a quote',
    referencesLabel: 'Indicative references',
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
    title: 'Layered pricing, from solo to full production',
    lead: 'KAI combines recurring cloud subscriptions for users and teams with enterprise per-production licences. Start on a cloud plan and scale to KAI 24/7 when your production calls for it.',
    notice: 'Pricing model v1. Indicative prices that we will keep refining with market feedback.',
  },

  error: {
    message: 'We could not load the plans.',
    retry: 'Retry',
  },

  empty: {
    message: 'No plans available yet.',
    hint: 'Write to us and we will tell you which options fit your production best.',
    linkLabel: 'Talk to us',
    linkHref: '/recursos',
  },

  reassurance: [
    { iconName: 'CreditCard', text: 'Recurring cloud subscription for Pro/Solo and Team' },
    { iconName: 'ShieldCheck', text: 'Tailored security and compliance on KAI 24/7' },
    { iconName: 'Headset', text: 'Support scaled to each production' },
  ] as const,

  comparison: {
    title: 'Compare KAI tiers',
    lead: 'From an individual cloud subscription to an enterprise per-production licence. Each tier fits the scale, the volume of footage and the operational demands.',
    planColumns: ['Audio Pro', 'Full Pro', 'Team', 'KAI 24/7'],
    a11y: { included: 'Included', notIncluded: 'Not included' },
    sections: [
      {
        title: 'Model and deployment',
        rows: [
          { label: 'Model', values: ['Cloud subscription', 'Cloud subscription', 'Cloud subscription', 'Per-production licence'] },
          { label: 'Cloud resources', values: ['Shared', 'Shared', 'Dedicated', 'Custom'] },
          { label: 'On-premise deployment', values: [false, false, false, true] },
          { label: 'Reference price', values: ['€59/mo', '€149/mo', '€299/mo', 'Custom'] },
        ],
      },
      {
        title: 'Capacity and engines',
        rows: [
          { label: 'Reference capacity', values: ['250 GB · 100 h', '250 GB · 100 h', '1 TB · 1,000 h', 'Custom'] },
          { label: 'Audio engine', values: [true, true, true, true] },
          { label: 'Video and advanced AI', values: [false, true, true, true] },
          { label: 'Collaborative work', values: [false, false, true, true] },
          { label: 'Tailored security / compliance', values: [false, false, false, true] },
          { label: 'Operational continuity', values: [false, false, false, true] },
        ],
      },
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'What is the difference between Audio Pro and Full Pro?',
        a: 'Both are entry cloud plans with a 250 GB or 100 h reference. Audio Pro (from €59/mo) is geared to audio-focused models; Full Pro (from €149/mo) unlocks all engines: audio, video and advanced AI.',
      },
      {
        q: 'Who is KAI Team for?',
        a: 'For small or mid-sized teams that need more capacity and reliability. It is a per-team cloud plan (€299/mo reference) with 1 TB or 1,000 h and dedicated cloud resources for better performance and predictability.',
      },
      {
        q: 'How is KAI 24/7 priced?',
        a: 'KAI 24/7 has no fixed rate: it is a custom per-production quote. The price depends on the number of cameras or signals, shooting days, ingest volume, features, integrations, support level and deployment constraints.',
      },
      {
        q: 'What are the €30,000 and €9,000 references?',
        a: 'They are indicative commercial references: Premium Reality Shows around €30,000 (avg ~3 months) and Small Reality Shows around €9,000 (avg ~1.5 months). Large productions are quoted on demand.',
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
