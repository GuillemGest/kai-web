import type { Subscription } from '../../../../modules/billing/domain/Subscription'

/**
 * Documento de textos de la página "Mi cuenta" (Account).
 *
 * Centraliza TODO el contenido textual de AccountPage en un único objeto tipado.
 * Objetivo: que la página no tenga texto hardcodeado y que traducir a otro
 * idioma sea trivial — basta con duplicar este archivo (p. ej. accountPage.content.en.ts)
 * y seleccionar el locale en el futuro.
 *
 * Regla: si aparece un texto nuevo en AccountPage, va aquí, no en el JSX.
 */
export const accountPageContent = {
  locale: 'es-ES',

  title: 'Mi cuenta',
  notLoggedIn: 'No has iniciado sesión.',

  profile: {
    title: 'Perfil',
    nameLabel: 'Nombre',
    emailLabel: 'Email',
  },

  subscription: {
    title: 'Suscripción',
    empty: 'No tienes ninguna suscripción activa.',
    statusLabel: 'Estado',
    planLabel: 'Plan',
    renewsAtLabel: 'Renueva el',
    manageButton: 'Gestionar pago',
    statusLabels: {
      active: 'Activa',
      canceled: 'Cancelada',
      past_due: 'Pago pendiente',
      none: 'Sin suscripción',
    } satisfies Record<Subscription['status'], string>,
  },
} as const
