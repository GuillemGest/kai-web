/**
 * Documento de textos de la página "Sobre KAI" (Company).
 *
 * Centraliza TODO el contenido textual de CompanyPage en un único objeto tipado.
 * Objetivo: que la página no tenga texto hardcodeado y que traducir a otro
 * idioma sea trivial — basta con duplicar este archivo (p. ej. companyPage.content.en.ts)
 * y seleccionar el locale en el futuro.
 *
 * Regla: si aparece un texto nuevo en CompanyPage, va aquí, no en el JSX.
 */
export const companyPageContent = {
  hero: {
    kicker: 'Sobre KAI',
    // El acento resalta la segunda frase del título (accent-text).
    titleLead: 'Cuenta la historia. ',
    titleAccent: 'KAI encuentra el clip.',
    titleTail: '',
    lead: 'KAI nace en Gestmusic (Banijay Entertainment), junto a Amplify, para resolver un problema muy concreto de la producción audiovisual: trabajar con grandes volúmenes de material sin perder horas en revisión manual. Construimos un plugin de IA que indexa el bruto, permite buscar momentos en lenguaje natural y lleva las selecciones al flujo de edición.',
  },

  mission: {
    title: 'Del material en bruto a la decisión editorial.',
    paragraphs: [
      'En muchas producciones, la historia no aparece en una línea de tiempo vacía: está escondida entre horas de entrevistas, cámaras, reacciones, escenas y notas de equipo. Las herramientas tradicionales ayudan a gestionar archivos o a editar, pero entre el bruto y el montaje sigue habiendo una fase lenta de búsqueda, catalogado y reconstrucción.',
      'KAI está diseñado para cubrir ese espacio. Indexa el material, permite explorarlo con tus propias palabras y convierte los resultados en selecciones listas para continuar en el editor. El objetivo no es sustituir el criterio del equipo, sino quitar fricción para que llegue antes a las decisiones que importan.',
    ],
  },

  partners: {
    title: 'Quién está detrás',
    intro:
      'KAI es una colaboración europea entre equipos de producción, producto, investigación y tecnología aplicada. Gestmusic y Amplify impulsan el desarrollo del producto, con el apoyo de EIT Culture & Creativity, la investigación de Fraunhofer IPK y tecnología de IA de Ugiat Technologies.',
    logoAriaLabelTemplate: 'Logo de {name}',
    items: [
      {
        name: 'Gestmusic',
        note: 'Banijay Entertainment',
        role: 'Aporta el contexto real de producción audiovisual y el conocimiento operativo desde el que nace KAI.',
        logoSrc: '/logosProject/gestmusicLogo.png',
      },
      {
        name: 'Amplify',
        note: 'Producto y desarrollo',
        role: 'Participa en el desarrollo de KAI y en su evolución como solución SaaS para flujos profesionales de media y entretenimiento.',
        logoSrc: '/logosProject/Aplify.webp',
      },
      {
        name: 'EIT Culture & Creativity',
        note: 'Proyecto europeo de innovación',
        role: 'Respalda el proyecto dentro del marco europeo de innovación impulsado por el European Institute of Innovation and Technology.',
        logoSrc: '/logosProject/EIT.png',
      },
      {
        name: 'Fraunhofer IPK',
        note: 'Investigación aplicada',
        role: 'Contribuye con investigación en comprensión visual avanzada para enriquecer la base tecnológica de KAI.',
        logoSrc: '/logosProject/IPK.png',
      },
      {
        name: 'Ugiat Technologies',
        note: 'Tecnología de IA',
        role: 'Aporta un núcleo de análisis de inteligencia artificial que refuerza la capacidad de KAI para estructurar y explorar material audiovisual.',
        logoSrc: '/logosProject/ugiat.png',
      },
    ],
  },

  cta: {
    title: '¿Vemos cómo encaja KAI en tu flujo?',
    lead: 'Cuéntanos cómo trabajáis, con qué volumen de material y en qué entorno de edición. Te ayudaremos a valorar la configuración de KAI que tenga sentido para tu producción.',
    primaryCtaLabelTemplate: 'Escribir a {email}',
  },
} as const
