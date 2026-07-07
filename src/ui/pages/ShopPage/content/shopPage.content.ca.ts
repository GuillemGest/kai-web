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
    freePriceLabel: 'Gratis',
    customCtaLabel: 'Demanar pressupost',
    freeCtaLabel: 'Comença gratis',
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
    title: 'Plans ajustats a cada projecte',
    lead: 'KAI ajunta subscripcions cloud recurrents per a usuaris i equips amb llicències per producció per al treball enterprise. Comença amb un pla cloud i puja a KAI Enterprise quan una producció t’ho demani.',
    notice: 'Pricing model v1. Preus orientatius que continuarem ajustant segons el feedback del mercat.',
  },

  error: {
    message: 'No hem pogut carregar els plans.',
    retry: 'Reintentar',
  },

  empty: {
    message: 'Encara no hi ha plans disponibles.',
    hint: 'Escriu-nos i t’indicarem les opcions que encaixen millor amb la teva producció.',
    linkLabel: 'Parlem',
    linkHref: '/recursos',
  },

  reassurance: [
    { iconName: 'CreditCard', text: 'Subscripció cloud recurrent per a Pro/Solo i Team' },
    { iconName: 'ShieldCheck', text: 'Seguretat i compliance a mida a KAI Enterprise' },
    { iconName: 'Headset', text: 'Suport ajustat a cada producció' },
  ] as const,

  comparison: {
    title: 'Compara els nivells de KAI',
    lead: 'D’una subscripció cloud individual a una llicència enterprise per producció. Cada nivell s’ajusta a l’escala, el volum de material i les exigències de la feina.',
    planColumns: ['KAI Free', 'KAI Audio Analysis', 'KAI Full', 'KAI Team', 'KAI Enterprise'],
    a11y: { included: 'Inclòs', notIncluded: 'No inclòs' },
    sections: [
      {
        title: 'Model i desplegament',
        rows: [
          { label: 'Modalitat', values: ['Cloud gratuït', 'Subscripció cloud', 'Subscripció cloud', 'Subscripció cloud', 'Llicència per producció'] },
          { label: 'Recursos cloud', values: ['Compartits', 'Compartits', 'Compartits', 'Dedicats', 'A mida'] },
          { label: 'Desplegament on-premise', values: [false, false, false, false, true] },
          { label: 'Preu de referència', values: ['Gratis', '59 €/mes', '149 €/mes', '299 €/mes', 'A mida'] },
        ],
      },
      {
        title: 'Capacitat i motors',
        rows: [
          { label: 'Capacitat de referència', values: ['2 GB · 1 h', '250 GB · 100 h', '250 GB · 100 h', '1 TB · 1.000 h', 'A mida'] },
          { label: 'Pujada de vídeo', values: [false, true, true, true, true] },
          { label: 'Motor d’àudio', values: [false, true, true, true, true] },
          { label: 'Vídeo i IA avançada', values: [false, false, true, true, true] },
          { label: 'Exportació a l’editor', values: [false, true, true, true, true] },
          { label: 'Treball col·laboratiu', values: [false, false, false, true, true] },
          { label: 'Seguretat / compliance a mida', values: [false, false, false, false, true] },
          { label: 'Continuïtat operativa', values: [false, false, false, false, true] },
        ],
      },
    ],
  },

  faq: {
    title: 'Preguntes freqüents',
    items: [
      {
        q: 'Quina diferència hi ha entre KAI Audio Analysis i KAI Full?',
        a: 'Tots dos són plans cloud d’entrada amb 250 GB o 100 h de referència. KAI Audio Analysis (des de 59 €/mes) s’orienta a models centrats en àudio, mentre que KAI Full (des de 149 €/mes) habilita tots els motors: àudio, vídeo i IA avançada.',
      },
      {
        q: 'Per a qui és KAI Team?',
        a: 'Per a equips petits i mitjans que necessiten més capacitat i fiabilitat. És un pla cloud per equip (299 €/mes de referència) amb 1 TB o 1.000 h i recursos cloud dedicats, per mantenir un rendiment estable i previsible.',
      },
      {
        q: 'Com es calcula el preu de KAI Enterprise?',
        a: 'KAI Enterprise no té tarifa fixa: es cotitza per producció. El preu depèn del nombre de càmeres o senyals, els dies de rodatge, el volum d’ingesta, les funcionalitats i integracions necessàries, el nivell de suport i les restriccions de desplegament.',
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
