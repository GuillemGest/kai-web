/**
 * Traduccions al català (ca) dels ítems del centre de recursos.
 * Els `id` són estables i coincideixen amb l’InMemoryResourceRepository.
 */
export const resourceTranslations: Record<
  string,
  { title: string; body: string; category: string }
> = {
  'what-is-kai': {
    title: 'Què és KAI?',
    body: 'KAI és un plugin d’IA per a equips de producció i postproducció audiovisual. Indexa material en brut, permet buscar moments en llenguatge natural i ajuda a convertir aquestes seleccions en material a punt per continuar editant.',
    category: 'Primers passos',
  },
  'basic-workflow': {
    title: 'Quin és el flux bàsic de treball amb KAI?',
    body: 'El flux general és: pujar o connectar el material, indexar-lo, buscar moments amb les teves paraules, revisar els resultats i exportar la selecció a l’editor. KAI està pensat per reduir el temps de revisió manual sense treure control a l’equip creatiu.',
    category: 'Primers passos',
  },
  'who-uses-kai': {
    title: 'Per a qui està pensat KAI?',
    body: 'KAI està pensat per a equips que treballen amb moltes hores de vídeo: producció, postproducció, story editors, realitzadors, editors, assistents d’edició i responsables de contingut. És especialment útil quan trobar el moment exacte consumeix massa temps.',
    category: 'Primers passos',
  },
  'login-required': {
    title: 'Cal iniciar sessió per fer servir KAI?',
    body: 'Sí. Per gestionar el teu pla i accedir als recursos disponibles, necessites un compte actiu a la web de KAI. L’accés pot dependre del pla, la llicència o la configuració acordada per a la teva producció.',
    category: 'Primers passos',
  },
  'check-compatibility': {
    title: 'Com sé si el meu entorn de treball és compatible?',
    body: 'La compatibilitat depèn de l’editor, la configuració del projecte i el tipus de desplegament. Abans d’activar KAI en un entorn professional, revisa els requisits indicats al teu compte o consulta amb l’equip de suport.',
    category: 'Instal·lació i requisits',
  },
  'supported-formats': {
    title: 'Quins formats d’arxiu puc fer servir amb KAI?',
    body: 'KAI està pensat per treballar amb material audiovisual professional, però els formats, còdecs i configuracions concretes s’han de validar segons cada producció. Si tens un flux tècnic específic, consulta la compatibilitat abans d’indexar grans volums de material.',
    category: 'Instal·lació i requisits',
  },
  'access-account': {
    title: 'Com accedeixo al meu compte?',
    body: 'Inicia sessió des de la web de KAI amb el correu associat al teu compte o al teu equip. Des d’allà podràs revisar el teu accés, el teu pla i les opcions disponibles per a la teva producció.',
    category: 'Compte i plans',
  },
  'change-plan': {
    title: 'Puc canviar el meu pla?',
    body: 'Sí, els plans estan pensats per adaptar-se a diferents tipus d’ús i producció. Les opcions de canvi, ampliació o ajust depenen de la teva subscripció actual i de les condicions associades al teu compte.',
    category: 'Compte i plans',
  },
  'more-capacity': {
    title: 'Què faig si necessito més capacitat per a una producció?',
    body: 'Si has de treballar amb més hores de material, més usuaris o necessitats tècniques específiques, contacta amb l’equip de KAI. Es pot revisar el cas per adaptar la llicència o la configuració al ritme real de la teva producció.',
    category: 'Compte i plans',
  },
  'billing-info': {
    title: 'On consulto les meves factures i dades de facturació?',
    body: 'Les dades de facturació i la informació del teu pla es gestionen des del teu compte, quan aquesta opció estigui disponible. Si no trobes una factura o necessites modificar dades administratives, contacta amb suport.',
    category: 'Compte i plans',
  },
  'what-is-indexing': {
    title: 'Què vol dir indexar material?',
    body: 'Indexar vol dir analitzar el contingut per convertir-lo en informació cercable. KAI pot utilitzar dades com transcripcions, etiquetes i context del material perquè després puguis trobar moments concrets amb llenguatge natural.',
    category: 'Cerca i indexació',
  },
  'indexing-time': {
    title: 'Quant triga la indexació?',
    body: 'El temps d’indexació depèn del volum de material, la durada dels clips, el tipus d’anàlisi i la configuració tècnica del projecte. En produccions amb molt contingut, el rendiment es revisa abans de definir el flux de treball.',
    category: 'Cerca i indexació',
  },
  'natural-language-search': {
    title: 'Com faig una cerca en llenguatge natural?',
    body: 'Escriu el que necessites com ho demanaries a una altra persona de l’equip: una frase, una situació, un tema, una reacció o una intervenció concreta. Com més clar sigui el context, més fàcil serà revisar resultats útils.',
    category: 'Cerca i indexació',
  },
  'reuse-searches': {
    title: 'Puc guardar o reutilitzar una cerca?',
    body: 'KAI està dissenyat per treballar amb sessions i converses que es poden recuperar i reutilitzar dins del projecte. Això ajuda a mantenir el context, evitar cerques repetides i compartir troballes amb l’equip.',
    category: 'Cerca i indexació',
  },
  'review-results': {
    title: 'Puc revisar els resultats abans d’exportar?',
    body: 'Sí. La idea és que puguis revisar els clips trobats, comprovar si encaixen amb la cerca i ajustar la selecció abans de portar-la a l’editor. KAI està pensat per donar suport a la decisió editorial, no per saltar-se-la.',
    category: 'Ús del plugin i integració NLE',
  },
  'order-clips': {
    title: 'Puc ordenar els clips abans d’exportar-los?',
    body: 'Sí. KAI permet treballar amb seleccions i playlists per organitzar els clips abans d’enviar-los al flux d’edició. Això ajuda a passar d’una cerca solta a una estructura narrativa més clara.',
    category: 'Ús del plugin i integració NLE',
  },
  'nle-integration': {
    title: 'Amb quins editors s’integra KAI?',
    body: 'KAI està orientat a fluxos professionals d’edició no lineal i la seva integració inicial se centra a Adobe Premiere Pro mitjançant un panell natiu. Per a altres entorns NLE, la compatibilitat i el mètode d’exportació es revisen segons el flux de treball.',
    category: 'Ús del plugin i integració NLE',
  },
  'what-exports-to-nle': {
    title: 'Què s’exporta a l’editor?',
    body: 'KAI exporta seleccions, estructures o playlists preparades a partir dels clips trobats, perquè l’equip pugui continuar el muntatge al seu editor. Els detalls de format i compatibilitat depenen de la configuració disponible per a cada entorn.',
    category: 'Ús del plugin i integració NLE',
  },
  'processing-location': {
    title: 'On es processa el meu material?',
    body: 'El processament pot variar segons el pla, la infraestructura i les necessitats de la producció. KAI contempla fluxos al núvol i configuracions adaptades a entorns professionals, per la qual cosa el model concret es defineix abans d’activar el servei.',
    category: 'Privacitat, seguretat i suport',
  },
  'content-access': {
    title: 'Qui pot accedir al material de la meva producció?',
    body: 'L’accés al material ha de quedar limitat als usuaris i equips autoritzats dins del projecte. En produccions amb requisits específics de control, permisos o confidencialitat, convé revisar la configuració amb l’equip de KAI abans de començar.',
    category: 'Privacitat, seguretat i suport',
  },
  'slow-performance': {
    title: 'Què faig si KAI va lent o triga a respondre?',
    body: 'El rendiment pot veure’s afectat pel volum de material, l’estat de la indexació, la connexió, la infraestructura o el tipus de cerca. Comprova primer que el material estigui indexat i, si el problema continua, contacta amb suport indicant el projecte i el comportament observat.',
    category: 'Privacitat, seguretat i suport',
  },
  'contact-support': {
    title: 'Com contacto amb suport?',
    body: 'Pots contactar amb l’equip de KAI des del botó de suport o contacte de la web. Per ajudar-te més ràpid, inclou una descripció del problema, el projecte afectat, l’editor que estàs fent servir i qualsevol missatge d’error disponible.',
    category: 'Privacitat, seguretat i suport',
  },
}
