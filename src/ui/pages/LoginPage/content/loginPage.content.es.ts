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
    // El asterisco delimita el fragmento resaltado dentro del quote (em).
    quoteLead: 'Encuentra los ',
    quoteEmphasis: 'momentos clave',
    quoteTail: ' sin revisar horas de metraje.',
    quoteMeta:
      'KAI indexa tu material, entiende tus búsquedas con lenguaje natural y exporta tus selecciones directamente a tu editor.',
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
    prototypeHint: 'Prototipo: usa demo@kai.app / kai1234 para entrar.',
    errorInvalidCredentials: 'Credenciales incorrectas. Inténtalo de nuevo.',
    redirectAfterLogin: '/cuenta',
    registerPrompt: '¿No tienes cuenta?',
    registerLink: 'Crear cuenta',
  },
} as const
