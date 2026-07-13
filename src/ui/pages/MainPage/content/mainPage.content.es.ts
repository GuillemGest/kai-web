/**
 * Documento de textos de la página principal (Producto).
 *
 * Centraliza TODO el contenido textual de MainPage en un único objeto tipado.
 * Objetivo: que la página no tenga texto hardcodeado y que traducir a otro
 * idioma sea trivial — basta con duplicar este archivo (p. ej. mainPage.content.en.ts)
 * y seleccionar el locale en el futuro.
 *
 * Regla: si aparece un texto nuevo en MainPage, va aquí, no en el JSX.
 */
export const mainPageContent = {
  hero: {
    // El asterisco delimita el fragmento resaltado dentro del título (accent-text).
    titleLead: 'Encuentra los ',
    titleAccent: 'momentos clave',
    titleTail: ' sin revisar horas de metraje',
    lead: 'KAI indexa tu material en bruto, entiende lo que le pides con lenguaje natural y exporta tus selecciones directamente a tu editor. Reduces el etiquetado manual y ganas tiempo para decidir, montar y contar mejor.',
    primaryCta: 'Ver planes',
    secondaryCta: 'Probar gratis',
    secondaryCtaHref: '/login?plan=free',
    videoAlt: 'KAI localizando los momentos clave dentro de una línea de tiempo de vídeo',
    videoPause: 'Pausar la demo',
    videoPlay: 'Reproducir la demo',
  },

  trustedBy: {
    title: 'Marcas líderes confían en nosotros:',
    logos: [
      { src: '/logoCompany/gestmusicLogo.png', alt: 'Gestmusic' },
      { src: '/logoCompany/tv3Logo.png', alt: 'TV3' },
    ],
  },

  compat: {
    // Nombres de plataforma = marcas: no se traducen. Solo las etiquetas.
    osLabel: 'Compatible con',
    os: ['macOS', 'Windows'],
    integrationLabel: 'Se integra en',
    integrationApp: 'Adobe Premiere Pro',
  },

  demo: {
    title: 'Describe lo que buscas. KAI encuentra los clips.',
    lead: 'No necesitas revisar horas de material ni etiquetar cada toma a mano. Describe lo que necesitas con lenguaje natural y KAI recorre el contenido indexado para devolverte los fragmentos relevantes, listos para seleccionar, ordenar y montar.',
    tag: 'Búsqueda de ejemplo',
    query: 'la entrevista donde habla del rodaje',
    result: 'KAI encuentra 4 momentos en 3,2 s',
    clips: [
      { time: '00:12', label: 'Habla del rodaje nocturno' },
      { time: '04:03', label: 'Cuenta una anécdota del set' },
      { time: '21:47', label: 'Explica cómo preparó el papel' },
      { time: '08:55', label: 'Dedica un mensaje al equipo' },
    ],
  },

  features: {
    heading: 'De horas de material a una selección lista para editar',
    items: [
      {
        title: 'Encuentra el momento exacto',
        body: 'Busca escenas, frases, temas o situaciones con lenguaje natural. KAI analiza el material indexado y localiza los clips relevantes, para que no tengas que empezar desde cero.',
      },
      {
        title: 'Construye tu playlist',
        body: 'Revisa resultados, arrastra clips, reordénalos y afina tu selección en un espacio diseñado para pasar con rapidez de una búsqueda a una primera estructura narrativa.',
      },
      {
        title: 'Llévalo a tu editor',
        body: 'Exporta tus selecciones a la herramienta donde ya montas. KAI funciona como plugin, de modo que la búsqueda realizada aquí se integra directamente en tu NLE.',
      },
    ],
  },

  faq: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Qué hace KAI exactamente?',
        a: 'KAI ayuda a los equipos de producción y postproducción a gestionar grandes volúmenes de material. Primero indexa el contenido en bruto, después permite buscar momentos con lenguaje natural y, por último, exporta tus selecciones al editor para que continúes el montaje.',
      },
      {
        q: '¿En qué se diferencia de un gestor de assets o de un editor tradicional?',
        a: 'Un gestor de assets almacena y localiza archivos. Un editor permite montar. KAI se sitúa entre ambos: comprende el contenido real del material, ayuda a encontrar momentos narrativos concretos y convierte los resultados en selecciones listas para editar. Tu criterio creativo se mantiene intacto; KAI se limita a eliminar el trabajo más laborioso antes de que decidas.',
      },
      {
        q: '¿Cómo llegan los clips al editor?',
        a: 'KAI se integra en flujos de edición profesional mediante un plugin y la exportación de selecciones. Buscas, revisas y organizas clips en KAI, y trasladas ese trabajo directamente a tu NLE para continuar el montaje sin rehacer la selección a mano. La forma exacta del traspaso depende de tu entorno de edición y se define durante la configuración.',
      },
      {
        q: '¿Qué tipo de material puede analizar KAI?',
        a: 'KAI está diseñado para material audiovisual en bruto, y resulta especialmente útil en producciones de gran volumen: formatos unscripted, realities, entrevistas, documentales, factual entertainment o contenidos multicámara. Los formatos, códecs y volúmenes concretos se revisan producción por producción para garantizar un flujo estable.',
      },
      {
        q: '¿Puede manejar producciones con muchas horas de contenido?',
        a: 'Sí. Es precisamente el problema que KAI nació para resolver. Su objetivo es reducir el tiempo dedicado a revisar, buscar y organizar metraje. La capacidad efectiva en cada caso depende del volumen, la infraestructura y las necesidades de la producción, por lo que acordamos el modelo de uso más adecuado antes de empezar.',
      },
      {
        q: '¿Qué pasa con la privacidad y la seguridad del material?',
        a: 'El material de una producción es sensible, y KAI está pensado para entornos profesionales donde el control de acceso, la trazabilidad y la seguridad son prioritarios. Definimos cómo se procesa, se almacena y se accede al material en cada proyecto y cada despliegue. Si tu producción tiene requisitos específicos, el equipo revisa el caso antes de activar el servicio.',
      },
      {
        q: '¿Quién está detrás de KAI y cómo puedo empezar?',
        a: 'KAI nace en Gestmusic (parte de Banijay) y en la iniciativa Amplify, y es un proyecto de innovación europeo con el apoyo de EIT Culture & Creativity y del European Institute of Innovation and Technology. Se apoya, además, en la investigación de Fraunhofer IPK y en un núcleo de IA desarrollado por Ugiat Technologies. Para empezar, consulta los planes o escribe al equipo para definir una licencia o suscripción que se ajuste a tu producción.',
      },
    ],
  },

  cta: {
    title: 'Convierte tu metraje en una selección lista para montar',
    lead: 'Suscríbete y empieza a buscar en tus vídeos con lenguaje natural. KAI se ocupa de la parte más laboriosa para que tu equipo se centre en lo esencial: seleccionar, ordenar y contar mejor.',
    primaryCta: 'Ver planes',
  },
} as const