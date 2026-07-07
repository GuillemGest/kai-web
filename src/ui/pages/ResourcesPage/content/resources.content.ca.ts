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
    body: 'KAI és un plugin d’IA per a equips de producció i postproducció audiovisual. Indexa material en brut, permet cercar moments amb llenguatge natural i converteix aquestes seleccions en material a punt per continuar editant.',
    category: 'Primers passos',
  },
  'basic-workflow': {
    title: 'Quin és el flux bàsic de treball amb KAI?',
    body: 'El flux general és: puges o connectes el teu material, l’indexes, cerques moments amb llenguatge natural, revises els resultats i exportes la selecció al teu editor. L’objectiu és reduir el temps de revisió manual mantenint l’equip creatiu al capdavant.',
    category: 'Primers passos',
  },
  'who-uses-kai': {
    title: 'Per a qui està pensat KAI?',
    body: 'Per a qualsevol que treballi amb grans volums de vídeo: equips de producció i postproducció, story editors, realitzadors, editors, assistents d’edició i responsables de contingut. Resulta especialment útil quan trobar el moment exacte consumeix massa temps.',
    category: 'Primers passos',
  },
  'login-required': {
    title: 'Cal iniciar sessió per fer servir KAI?',
    body: 'Sí. Necessites un compte actiu a la web de KAI per gestionar el teu pla i accedir als recursos disponibles. L’accés pot dependre del pla, la llicència o la configuració acordada per a la teva producció.',
    category: 'Primers passos',
  },
  'check-compatibility': {
    title: 'Com sé si el meu entorn de treball és compatible?',
    body: 'Depèn del teu editor, de com estigui configurat el projecte i del tipus de desplegament. Abans d’activar KAI en un entorn professional, revisa els requisits indicats al teu compte o consulta amb l’equip de suport.',
    category: 'Instal·lació i requisits',
  },
  'supported-formats': {
    title: 'Quins formats d’arxiu puc fer servir amb KAI?',
    body: 'KAI treballa amb material audiovisual professional, però els formats, còdecs i configuracions concretes s’han de validar producció per producció. Si utilitzes un flux tècnic particular, confirma la compatibilitat abans d’indexar grans volums de material.',
    category: 'Instal·lació i requisits',
  },
  'access-account': {
    title: 'Com accedeixo al meu compte?',
    body: 'Inicia sessió a la web de KAI amb el correu associat al teu compte o al teu equip. Des d’allà pots consultar el teu accés, el teu pla i les opcions disponibles per a la teva producció.',
    category: 'Compte i plans',
  },
  'change-plan': {
    title: 'Puc canviar el meu pla?',
    body: 'Sí. Els plans estan dissenyats per adaptar-se a diferents tipus d’ús i producció. Les opcions de canvi, ampliació o ajust depenen de la teva subscripció actual i de les condicions associades al teu compte.',
    category: 'Compte i plans',
  },
  'more-capacity': {
    title: 'Què faig si necessito més capacitat per a una producció?',
    body: 'Si vas a treballar amb més hores de material, més usuaris o necessitats tècniques concretes, posa’t en contacte amb l’equip de KAI. Podem revisar el cas i adaptar la llicència o la configuració al ritme real de la teva producció.',
    category: 'Compte i plans',
  },
  'billing-info': {
    title: 'On consulto les meves factures i dades de facturació?',
    body: 'Gestiones les dades de facturació i la informació del teu pla des del teu compte, on aquesta opció estigui disponible. Si et falta una factura o necessites canviar dades administratives, posa’t en contacte amb suport.',
    category: 'Compte i plans',
  },
  'what-is-indexing': {
    title: 'Què vol dir indexar material?',
    body: 'Indexar consisteix a analitzar el teu contingut per convertir-lo en informació cercable. KAI es recolza en elements com transcripcions, etiquetes i el context del material perquè després puguis localitzar moments concrets amb llenguatge natural.',
    category: 'Cerca i indexació',
  },
  'indexing-time': {
    title: 'Quant triga la indexació?',
    body: 'Depèn del volum de material, la durada dels clips, el tipus d’anàlisi i la configuració tècnica del projecte. En produccions amb molt contingut es revisa el rendiment abans de definir el flux de treball.',
    category: 'Cerca i indexació',
  },
  'natural-language-search': {
    title: 'Com faig una cerca en llenguatge natural?',
    body: 'Descriu el que busques com ho plantejaries a una altra persona de l’equip: una frase, una situació, un tema, una reacció o una intervenció concreta. Com més context aportis, més fàcil serà obtenir resultats útils.',
    category: 'Cerca i indexació',
  },
  'reuse-searches': {
    title: 'Puc guardar o reutilitzar una cerca?',
    body: 'Sí. KAI treballa amb sessions i converses que pots recuperar i reutilitzar dins del projecte, la qual cosa ajuda a mantenir el context, evitar cerques repetides i compartir les troballes amb l’equip.',
    category: 'Cerca i indexació',
  },
  'review-results': {
    title: 'Puc revisar els resultats abans d’exportar?',
    body: 'Sí. Pots revisar els clips trobats, comprovar si s’ajusten al que buscaves i afinar la selecció abans que arribi a l’editor. KAI està pensat per donar suport a la teva decisió editorial, no per substituir-la.',
    category: 'Ús del plugin i integració NLE',
  },
  'order-clips': {
    title: 'Puc ordenar els clips abans d’exportar-los?',
    body: 'Sí. KAI permet treballar amb seleccions i playlists per organitzar els clips abans d’enviar-los al flux d’edició, la qual cosa ajuda a passar d’una cerca dispersa a una estructura narrativa més clara.',
    category: 'Ús del plugin i integració NLE',
  },
  'nle-integration': {
    title: 'Amb quins editors s’integra KAI?',
    body: 'KAI està orientat a l’edició no lineal professional. Actualment s’integra amb Adobe Premiere Pro mitjançant un panell natiu, l’únic entorn NLE compatible de manera nativa de moment. Es tracta, però, del punt de partida: anirem incorporant editors de manera progressiva, segons les necessitats dels equips i l’evolució de cada flux, amb la compatibilitat i el mètode d’exportació adaptats a cadascun.',
    category: 'Ús del plugin i integració NLE',
  },
  'what-exports-to-nle': {
    title: 'Què s’exporta a l’editor?',
    body: 'KAI exporta les seleccions, estructures o playlists preparades a partir dels clips trobats, perquè l’equip reprengui el muntatge al seu propi editor. El format i la compatibilitat exactes depenen de la configuració disponible a cada entorn.',
    category: 'Ús del plugin i integració NLE',
  },
  'processing-location': {
    title: 'On es processa el meu material?',
    body: 'Depèn del pla, la infraestructura i les necessitats de la producció. KAI contempla fluxos al núvol i configuracions adaptades a entorns professionals, per la qual cosa definim el model concret amb tu abans d’activar el servei.',
    category: 'Privacitat, seguretat i suport',
  },
  'content-access': {
    title: 'Qui pot accedir al material de la meva producció?',
    body: 'L’accés al material s’ha de limitar als usuaris i equips autoritzats del projecte. Si la teva producció té requisits concrets de control, permisos o confidencialitat, revisa la configuració amb l’equip de KAI abans de començar.',
    category: 'Privacitat, seguretat i suport',
  },
  'slow-performance': {
    title: 'Què faig si KAI va lent o triga a respondre?',
    body: 'El rendiment pot veure’s afectat pel volum de material, l’estat de la indexació, la connexió, la infraestructura o el tipus de cerca. Comprova primer que el material estigui indexat i, si el problema persisteix, contacta amb suport indicant el projecte i el comportament observat.',
    category: 'Privacitat, seguretat i suport',
  },
  'contact-support': {
    title: 'Com contacto amb suport?',
    body: 'Pots contactar amb l’equip de KAI des del botó de suport o contacte de la web. Per agilitzar l’ajuda, indica’ns quin problema tens, a quin projecte afecta, quin editor utilitzes i qualsevol missatge d’error disponible.',
    category: 'Privacitat, seguretat i suport',
  },
}
