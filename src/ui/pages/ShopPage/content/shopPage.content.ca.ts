/**
 * Traducció al català (ca) del contingut de ShopPage.
 */
export const shopPageContent = {
  planCard: {
    popularBadge: 'Més popular',
    pricePeriodMonth: '/mes',
    pricePeriodYear: '/any',
    priceFromPrefix: 'des de',
    customPriceLabel: 'A mida',
    customCtaLabel: 'Demanar pressupost',
    referencesLabel: 'Referències orientatives',
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
    title: 'Un pricing per capes, del solo a la gran producció',
    lead: 'KAI combina subscripcions cloud recurrents per a usuaris i equips amb llicències enterprise per producció. Comença amb un pla cloud i escala a KAI 24/7 quan la teva producció ho demani.',
    notice: 'Pricing model v1. Preus orientatius que continuarem refinant amb feedback de mercat.',
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
    { iconName: 'CreditCard', text: 'Subscripció cloud recurrent per a Pro/Solo i Team' },
    { iconName: 'ShieldCheck', text: 'Seguretat i compliance a mida a KAI 24/7' },
    { iconName: 'Headset', text: 'Suport ajustat a l’abast de cada producció' },
  ] as const,

  comparison: {
    title: 'Compara els nivells de KAI',
    lead: 'De la subscripció cloud individual a la llicència enterprise per producció. Cada nivell s’ajusta a l’escala, el volum de material i les exigències operatives.',
    planColumns: ['Audio Pro', 'Full Pro', 'Team', 'KAI 24/7'],
    a11y: { included: 'Inclòs', notIncluded: 'No inclòs' },
    sections: [
      {
        title: 'Model i desplegament',
        rows: [
          { label: 'Modalitat', values: ['Subscripció cloud', 'Subscripció cloud', 'Subscripció cloud', 'Llicència per producció'] },
          { label: 'Recursos cloud', values: ['Compartits', 'Compartits', 'Dedicats', 'A mida'] },
          { label: 'Desplegament on-premise', values: [false, false, false, true] },
          { label: 'Preu de referència', values: ['59 €/mes', '149 €/mes', '299 €/mes', 'A mida'] },
        ],
      },
      {
        title: 'Capacitat i motors',
        rows: [
          { label: 'Capacitat de referència', values: ['250 GB · 100 h', '250 GB · 100 h', '1 TB · 1.000 h', 'A mida'] },
          { label: 'Motor d’àudio', values: [true, true, true, true] },
          { label: 'Vídeo i IA avançada', values: [false, true, true, true] },
          { label: 'Treball col·laboratiu', values: [false, false, true, true] },
          { label: 'Seguretat / compliance a mida', values: [false, false, false, true] },
          { label: 'Continuïtat operativa', values: [false, false, false, true] },
        ],
      },
    ],
  },

  faq: {
    title: 'Preguntes freqüents',
    items: [
      {
        q: 'Quina diferència hi ha entre Audio Pro i Full Pro?',
        a: 'Tots dos són plans cloud d’entrada amb 250 GB o 100 h de referència. Audio Pro (des de 59 €/mes) s’orienta a models centrats en àudio; Full Pro (des de 149 €/mes) desbloqueja tots els motors: àudio, vídeo i IA avançada.',
      },
      {
        q: 'Per a qui és KAI Team?',
        a: 'Per a equips petits o mitjans que necessiten més capacitat i fiabilitat. És un pla cloud per equip (299 €/mes de referència) amb 1 TB o 1.000 h i recursos cloud dedicats per millorar rendiment i previsibilitat.',
      },
      {
        q: 'Com es calcula el preu de KAI 24/7?',
        a: 'KAI 24/7 no té tarifa fixa: és una cotització a mida per producció. El preu depèn del nombre de càmeres o senyals, dies de rodatge, volum d’ingesta, funcionalitats, integracions, nivell de suport i restriccions de desplegament.',
      },
      {
        q: 'Què són les referències de 30.000 € i 9.000 €?',
        a: 'Són referències comercials orientatives: Premium Reality Shows al voltant de 30.000 € (mitjana ~3 mesos) i Small Reality Shows al voltant de 9.000 € (mitjana ~1,5 mesos). Les grans produccions es pressuposten sota demanda.',
      },
      // Pregunta desactivada temporalment (pendent de decisió de negoci sobre el pricing v1).
      // {
      //   q: 'El pricing és definitiu?',
      //   a: 'És un pricing model v1. La política de preus continuarà refinant-se amb feedback de mercat per mantenir-se flexible i competitiva en diferents perfils de client i geografies.',
      // },
    ],
  },
} as const

export type ShopReassuranceIcon = (typeof shopPageContent.reassurance)[number]['iconName']
