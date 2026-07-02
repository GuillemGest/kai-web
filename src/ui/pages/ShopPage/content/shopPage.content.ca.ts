/**
 * Traducció al català (ca) del contingut de ShopPage.
 */
export const shopPageContent = {
  planCard: {
    popularBadge: 'Més popular',
    pricePeriodMonth: '/mes',
    pricePeriodYear: '/any',
    selectCtaTemplate: 'Triar {name}',
    discountBadgeTemplate: 'Estalvia {percent}%',
  },

  billingToggle: {
    label: 'Període de facturació',
    monthly: 'Mensual',
    yearly: 'Anual',
    savingsHint: 'Estalvia {percent}%',
  },

  yearlyDiscountPercent: 20,

  head: {
    title: 'Tria el pla que va amb el teu ritme',
    lead: 'Subscripció mensual a KAI amb totes les seves actualitzacions. Comença petit i puja de pla quan el teu volum de vídeo ho demani.',
    notice: 'Preus orientatius; l’import definitiu es confirma al checkout.',
  },

  error: {
    message: 'No hem pogut carregar els plans.',
    retry: 'Reintentar',
  },

  empty: {
    message: 'Encara no hi ha plans disponibles.',
    hint: 'Escriu-nos i t’expliquem les opcions que encaixen millor amb la teva producció.',
    linkLabel: 'Parlem',
    linkHref: '/recursos',
  },

  reassurance: [
    { iconName: 'ShieldCheck', text: 'Sense permanència, cancel·la quan vulguis' },
    { iconName: 'CreditCard', text: 'Facturació mensual, sense sorpreses' },
    { iconName: 'Headset', text: 'Suport per persones, no bots' },
  ] as const,

  comparison: {
    title: 'Compara totes les característiques',
    lead: 'KAI ofereix plans per a creadors individuals i equips, per accelerar la postproducció sense friccions.',
    planColumns: ['Individual', 'Pro', 'Studio'],
    a11y: { included: 'Inclòs', notIncluded: 'No inclòs' },
    sections: [
      {
        title: 'Funcions principals',
        rows: [
          { label: 'Transcripció avançada i identificació de parlants', values: [true, true, true] },
          { label: 'Resums i anàlisi', values: [true, true, true] },
          { label: 'Talls ràpids amb IA', values: [false, true, true] },
          { label: 'Notes en llenguatge natural per guiar edicions', values: [false, true, true] },
          { label: 'Edicions mensuals incloses', values: ['20', 'Il·limitades', 'Il·limitades'] },
          { label: 'Hores de vídeo ingestades al mes', values: ['2 h', '20 h', 'Il·limitades'] },
        ],
      },
      {
        title: 'Funcions avançades',
        rows: [
          { label: 'Multi-edicions a tot el material', values: [false, true, true] },
          { label: 'Col·laboració en equip', values: [false, false, true] },
          { label: 'Personalització d’IA', values: [false, true, true] },
          { label: 'Suport', values: ['Email', 'Prioritari', 'Dedicat'] },
          { label: 'Seguretat', values: [true, true, 'Enterprise'] },
          { label: 'Gestió d’equips', values: [false, false, true] },
          { label: 'SSO', values: [false, false, true] },
        ],
      },
    ],
  },

  faq: {
    title: 'Preguntes freqüents',
    items: [
      {
        q: 'Puc canviar de pla més endavant?',
        a: 'Sí. Pots pujar o baixar de pla en qualsevol moment des del teu compte; el canvi es prorrateja a la següent factura.',
      },
      {
        q: 'Hi ha permanència o compromís anual?',
        a: 'No. Tots els plans són mensuals i pots cancel·lar quan vulguis. Continues tenint accés fins al final del període pagat.',
      },
      {
        q: 'Els preus inclouen IVA?',
        a: 'Els preus es mostren sense IVA. L’impost aplicable es calcula al checkout segons el teu país i les teves dades de facturació.',
      },
      {
        q: 'Què passa si supero les hores de vídeo del meu pla?',
        a: 'T’avisem abans d’arribar al límit. Pots esperar al següent cicle o pujar de pla a l’instant per continuar treballant.',
      },
      {
        q: 'Necessito targeta per començar?',
        a: 'Per subscriure’t sí. La subscripció activa la cerca amb IA i l’exportació.',
      },
    ],
  },
} as const

export type ShopReassuranceIcon = (typeof shopPageContent.reassurance)[number]['iconName']
