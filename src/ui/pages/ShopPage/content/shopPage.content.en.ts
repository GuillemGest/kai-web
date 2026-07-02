/**
 * English (en) translation of ShopPage content.
 */
export const shopPageContent = {
  planCard: {
    popularBadge: 'Most popular',
    pricePeriodMonth: '/mo',
    pricePeriodYear: '/yr',
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
    title: 'Pick the plan that suits your pace',
    lead: 'Monthly subscription to KAI with all its updates. Start small and move up when your video volume calls for it.',
    notice: 'Prices are indicative; the final amount is confirmed at checkout.',
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
    { iconName: 'ShieldCheck', text: 'No commitment, cancel anytime' },
    { iconName: 'CreditCard', text: 'Monthly billing, no surprises' },
    { iconName: 'Headset', text: 'Support by people, not bots' },
  ] as const,

  comparison: {
    title: 'Compare all plan features',
    lead: 'KAI offers plans for individual creators and teams to accelerate post and unleash their creativity.',
    planColumns: ['Individual', 'Pro', 'Studio'],
    a11y: { included: 'Included', notIncluded: 'Not included' },
    sections: [
      {
        title: 'Main features',
        rows: [
          { label: 'Advanced transcription and speaker identification', values: [true, true, true] },
          { label: 'Summaries and analysis', values: [true, true, true] },
          { label: 'Instant AI rough cuts', values: [false, true, true] },
          { label: 'Natural-language notes to guide edits', values: [false, true, true] },
          { label: 'Monthly edits included', values: ['20', 'Unlimited', 'Unlimited'] },
          { label: 'Monthly hours of ingested footage', values: ['2 h', '20 h', 'Unlimited'] },
        ],
      },
      {
        title: 'Advanced features',
        rows: [
          { label: 'Multi-edits across all your footage', values: [false, true, true] },
          { label: 'Team collaboration', values: [false, false, true] },
          { label: 'AI customization', values: [false, true, true] },
          { label: 'Support', values: ['Email', 'Priority', 'Dedicated'] },
          { label: 'Security', values: [true, true, 'Enterprise'] },
          { label: 'Team management', values: [false, false, true] },
          { label: 'SSO', values: [false, false, true] },
        ],
      },
    ],
  },

  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Can I change my plan later?',
        a: 'Yes. You can move up or down at any time from your account; the change is prorated on the next invoice.',
      },
      {
        q: 'Is there a commitment or annual contract?',
        a: 'No. All plans are monthly and you can cancel whenever you want. You keep access until the end of the paid period.',
      },
      {
        q: 'Do the prices include VAT?',
        a: 'Prices are shown without VAT. The applicable tax is calculated at checkout based on your country and billing details.',
      },
      {
        q: 'What happens if I exceed the video hours in my plan?',
        a: 'We warn you before you hit the limit. You can wait for the next cycle or upgrade instantly to keep working.',
      },
      {
        q: 'Do I need a card to get started?',
        a: 'To subscribe, yes. The subscription enables AI search and export.',
      },
    ],
  },
} as const

export type ShopReassuranceIcon = (typeof shopPageContent.reassurance)[number]['iconName']
