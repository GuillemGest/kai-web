/**
 * Documento de textos de la página de inicio de sesión (Login).
 *
 * Centraliza TODO el contenido textual de LoginPage en un único objeto tipado.
 * Objetivo: que la página no tenga texto hardcodeado y que traducir a otro
 * idioma sea trivial — basta con duplicar este archivo (p. ej. loginPage.content.en.ts)
 * y seleccionar el locale en el futuro.
 *
 * Regla: si aparece un texto nuevo en LoginPage, va aquí, no en el JSX.
 */
export const loginPageContent = {
  brand: {
    videoSrc: '/demo.mp4',
    videoAlt: 'Demostración de KAI localizando momentos clave en vídeo',
    // El asterisco delimita el fragmento resaltado dentro del quote (em).
    quoteLead: 'Encuentra los ',
    quoteEmphasis: 'momentos clave',
    quoteTail: ' sin revisar horas de metraje.',
    quoteMeta:
      'KAI indexa tu material, entiende búsquedas en lenguaje natural y exporta las selecciones directamente a tu editor.',
  },

  form: {
    heading: 'Iniciar sesión',
    subheading: 'Accede a tu cuenta para continuar.',
    emailLabel: 'Email',
    emailPlaceholder: 'tu@email.com',
    passwordLabel: 'Contraseña',
    passwordPlaceholder: '••••••••',
    submitIdle: 'Entrar',
    submitLoading: 'Entrando…',
    prototypeHint: 'Prototipo: cualquier credencial inicia sesión.',
    errorInvalidCredentials: 'Credenciales incorrectas. Inténtalo de nuevo.',
    redirectAfterLogin: '/cuenta',
  },
} as const
