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
    lead: 'KAI nace en Gestmusic (Banijay Entertainment), junto a Amplify, para resolver un reto muy concreto de la producción audiovisual: gestionar grandes volúmenes de material sin dedicar horas a la revisión manual. Desarrollamos un plugin de IA que indexa el material en bruto, permite buscar momentos con lenguaje natural y traslada las selecciones a tu flujo de edición.',
  },

  mission: {
    title: 'Del material en bruto a la decisión editorial.',
    paragraphs: [
      'En la mayoría de producciones, la historia no aparece en una línea de tiempo vacía: se encuentra dispersa entre horas de entrevistas, cámaras, reacciones, escenas y notas de equipo. Las herramientas convencionales ayudan a gestionar los archivos o a montarlos, pero entre el material en bruto y la pieza final sigue habiendo una fase lenta de búsqueda, catalogación y reconstrucción.',
      'Ese es el vacío que KAI resuelve. Indexa el material, permite explorarlo con lenguaje natural y convierte los resultados en selecciones que pasan directamente al editor. El criterio del equipo se mantiene intacto; KAI se limita a eliminar la fricción del proceso para que esas decisiones lleguen antes.',
    ],
  },

  partners: {
    title: 'Quién está detrás',
    intro:
      'KAI es una colaboración europea que reúne a equipos de producción, producto, investigación y tecnología aplicada. Gestmusic y Amplify lideran el desarrollo del producto, con el respaldo de EIT Culture & Creativity, la investigación de Fraunhofer IPK y la tecnología de IA de Ugiat Technologies.',
    logoAriaLabelTemplate: 'Logo de {name}',
    items: [
      {
        name: 'Gestmusic',
        note: 'Banijay Entertainment',
        role: 'Aporta el contexto real de producción audiovisual y el saber hacer práctico del que surgió KAI.',
        logoSrc: '/logosProject/gestmusicLogo.png',
      },
      {
        name: 'Amplify',
        note: 'Producto y desarrollo',
        role: 'Participa en el desarrollo de KAI y en su evolución como producto SaaS para flujos profesionales de media y entretenimiento.',
        logoSrc: '/logosProject/Aplify.webp',
      },
      {
        name: 'EIT Culture & Creativity',
        note: 'Proyecto europeo de innovación',
        role: 'Respalda el proyecto como parte del marco europeo de innovación que dirige el European Institute of Innovation and Technology.',
        logoSrc: '/logosProject/EIT.png',
      },
      {
        name: 'Fraunhofer IPK',
        note: 'Investigación aplicada',
        role: 'Aporta investigación en comprensión visual avanzada que refuerza la tecnología que hay detrás de KAI.',
        logoSrc: '/logosProject/IPK.png',
      },
      {
        name: 'Ugiat Technologies',
        note: 'Tecnología de IA',
        role: 'Aporta el núcleo de análisis de IA que permite a KAI estructurar y explorar material audiovisual.',
        logoSrc: '/logosProject/ugiat.png',
      },
    ],
  },

  cta: {
    title: '¿Vemos cómo encaja KAI en tu flujo de trabajo?',
    lead: 'Cuéntanos cómo trabajáis, qué volumen de material gestionáis y qué editor utilizáis. Te ayudaremos a encontrar la configuración de KAI que tenga sentido para tu producción.',
    primaryCtaLabelTemplate: 'Escribir a {email}',
  },
} as const
