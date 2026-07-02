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
    lead: 'KAI indexa tu material en bruto, entiende búsquedas en lenguaje natural y exporta tus selecciones directamente a tu editor. Menos logging manual. Más tiempo para decidir, montar y contar mejor.',
    primaryCta: 'Ver planes',
    videoAlt: 'KAI localizando los momentos clave dentro de una línea de tiempo de vídeo',
  },

  trustedBy: {
    title: 'Confían en KAI',
    logos: [
      { src: '/logoCompany/gestmusicLogo.png', alt: 'Gestmusic' },
      { src: '/logoCompany/tv3Logo.png', alt: 'TV3' },
    ],
  },

  demo: {
    title: 'Describe lo que buscas. KAI encuentra los clips.',
    lead: 'No tienes que revisar horas de material ni etiquetar cada toma a mano. Escribe una búsqueda como se la pedirías a tu equipo y KAI recorre el contenido indexado para devolverte los fragmentos relevantes, listos para seleccionar, ordenar y montar.',
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
        body: 'Busca escenas, frases, temas o situaciones en lenguaje natural. KAI analiza el material indexado y localiza los clips relevantes para que no tengas que empezar desde cero.',
      },
      {
        title: 'Construye tu playlist',
        body: 'Revisa resultados, arrastra clips, cambia el orden y ajusta tu selección en un espacio pensado para pasar rápido de la búsqueda a la estructura narrativa.',
      },
      {
        title: 'Llévalo a tu editor',
        body: 'Exporta tus selecciones al flujo de trabajo donde ya montas. KAI funciona como plugin y conecta el trabajo de búsqueda con la edición en tu NLE.',
      },
    ],
  },

  faq: {
    title: 'Preguntas frecuentes',
    items: [
      {
        q: '¿Qué hace KAI exactamente?',
        a: 'KAI ayuda a los equipos de producción y postproducción a trabajar con grandes volúmenes de material audiovisual. Primero indexa el contenido en bruto, después permite buscar momentos en lenguaje natural y, finalmente, exporta las selecciones al editor para seguir trabajando en el montaje.',
      },
      {
        q: '¿En qué se diferencia de un gestor de assets o de un editor tradicional?',
        a: 'Un gestor de assets te ayuda a almacenar y localizar archivos. Un editor te permite montar. KAI se sitúa entre ambos: entiende el contenido del material, permite encontrar momentos narrativos concretos y convierte los resultados en selecciones útiles para edición. No sustituye tu criterio creativo; reduce el trabajo pesado antes de tomar decisiones.',
      },
      {
        q: '¿Cómo llegan los clips al editor?',
        a: 'KAI está pensado para integrarse en flujos de edición profesional mediante plugin y exportación de selecciones. La idea es que puedas buscar, revisar y organizar clips en KAI, y llevar ese trabajo directamente a tu NLE para continuar el montaje sin reconstruir la selección a mano. Los detalles de integración dependen del entorno de edición y se concretan durante la configuración.',
      },
      {
        q: '¿Qué tipo de material puede analizar KAI?',
        a: 'KAI está diseñado para trabajar con material audiovisual en bruto, especialmente en producciones con mucho volumen de vídeo, como formatos unscripted, realities, entrevistas, documentales, factual entertainment o contenidos multicámara. Los formatos, códecs y volúmenes concretos se revisan según cada producción para asegurar un flujo estable y compatible.',
      },
      {
        q: '¿Puede manejar producciones con muchas horas de contenido?',
        a: 'Sí, KAI nace precisamente para resolver el problema de trabajar con grandes cantidades de metraje. Está pensado para reducir el tiempo dedicado a revisar, buscar y organizar material. La capacidad operativa final depende del volumen, la infraestructura y las necesidades de cada producción, por eso se define el mejor modelo de uso antes de empezar.',
      },
      {
        q: '¿Qué pasa con la privacidad y la seguridad del material?',
        a: 'El material audiovisual de una producción es sensible, y KAI está pensado para entornos profesionales donde el control de acceso, la trazabilidad y la seguridad importan. Las condiciones de procesamiento, almacenamiento y acceso se definen según el proyecto y el tipo de despliegue. Para producciones con requisitos específicos, el equipo de KAI revisa el caso antes de activar el servicio.',
      },
      {
        q: '¿Quién está detrás de KAI y cómo puedo empezar?',
        a: 'KAI nace en Gestmusic, parte de Banijay, dentro de la iniciativa Amplify y como proyecto de innovación europeo con apoyo de EIT Culture & Creativity, respaldado por el European Institute of Innovation and Technology. Cuenta además con investigación de Fraunhofer IPK y un núcleo de IA desarrollado por Ugiat Technologies. Para empezar, puedes revisar los planes o contactar con el equipo para definir una licencia o suscripción adaptada a tu producción.',
      },
    ],
  },

  cta: {
    title: 'Convierte tu metraje en una selección lista para montar',
    lead: 'Suscríbete y empieza a buscar en tus vídeos con lenguaje natural. KAI se ocupa del trabajo pesado para que tu equipo pueda centrarse en seleccionar, ordenar y contar mejor.',
    primaryCta: 'Ver planes',
  },
} as const