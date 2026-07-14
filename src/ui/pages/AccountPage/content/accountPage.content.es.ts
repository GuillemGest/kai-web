import type { Subscription } from '../../../../modules/billing/domain/Subscription'
import type { InvoiceStatus } from '../../../../modules/billing/domain/Invoice'

/**
 * Documento de textos del panel "Mi cuenta" (Account).
 *
 * Centraliza TODO el contenido textual de las 4 secciones del panel en un único
 * objeto tipado. Objetivo: que la página no tenga texto hardcodeado y que
 * traducir a otro idioma sea trivial — basta con duplicar este archivo
 * (p. ej. accountPage.content.en.ts) y traducir los valores.
 *
 * Regla: si aparece un texto nuevo en el panel de cuenta, va aquí, no en el JSX.
 */
export const accountPageContent = {
  locale: 'es-ES',

  title: 'Mi cuenta',
  subtitle: 'Gestiona tu perfil, tu suscripción, tu equipo y tu seguridad.',
  notLoggedIn: 'No has iniciado sesión.',
  logoutButton: 'Cerrar sesión',

  /**
   * Aviso de prueba gratis iniciada. Se muestra al llegar a la cuenta con
   * ?trial=started (tras entrar desde el chip "Prueba gratis" de planes).
   * Solo apariencia: de momento no se persiste ningún estado de prueba.
   */
  trialBanner: {
    title: 'Tu prueba gratis ha empezado',
    text: 'Tienes 15 días para probar KAI sin coste. Descarga el plugin y empieza a encontrar tus mejores momentos.',
    dismissLabel: 'Cerrar aviso',
  },

  /** Etiquetas de la navegación lateral. El orden aquí fija el orden en el sidebar. */
  nav: {
    account: 'Cuenta',
    billing: 'Facturación',
    team: 'Administración',
    security: 'Seguridad',
  },

  account: {
    title: 'Información de la cuenta',
    description: 'Los datos con los que identificamos tu cuenta de KAI.',
    nameLabel: 'Nombre',
    emailLabel: 'Email',
    memberSinceLabel: 'Miembro desde',
    languageLabel: 'Idioma preferido',
    editButton: 'Editar perfil',
    changePasswordButton: 'Cambiar contraseña',
  },

  billing: {
    title: 'Facturación',
    description: 'Tu plan actual, tu método de pago y tus facturas.',
    plan: {
      title: 'Plan actual',
      empty: 'No tienes ninguna suscripción activa.',
      statusLabel: 'Estado',
      planLabel: 'Plan',
      renewsAtLabel: 'Renueva el',
      canceledAtLabel: 'Finaliza el',
      changePlanButton: 'Cambiar de plan',
      statusLabels: {
        active: 'Activa',
        canceled: 'Cancelada',
        past_due: 'Pago pendiente',
        none: 'Sin suscripción',
      } satisfies Record<Subscription['status'], string>,
    },
    paymentMethod: {
      title: 'Método de pago',
      empty: 'No has añadido ningún método de pago.',
      expiresLabel: 'Caduca',
      updateButton: 'Actualizar tarjeta',
    },
    invoices: {
      title: 'Historial de facturas',
      empty: 'Todavía no hay facturas.',
      numberLabel: 'Factura',
      dateLabel: 'Fecha',
      amountLabel: 'Importe',
      statusLabel: 'Estado',
      downloadLabel: 'Descargar PDF',
      downloadAriaLabel: 'Descargar factura {number} en PDF',
      statusLabels: {
        paid: 'Pagada',
        open: 'Pendiente',
        void: 'Anulada',
        uncollectible: 'Impagada',
        refunded: 'Reembolsada',
      } satisfies Record<InvoiceStatus, string>,
    },
  },

  team: {
    title: 'Administración de usuarios',
    description: 'Usuarios de cada organización de la plataforma.',
    inviteButton: 'Invitar a alguien',
    organizationLabel: 'Organización',
    usersInOrg: 'usuarios en esta organización',
    emptyUsers: 'No hay usuarios para mostrar.',
    fullAdminLabel: 'Administrador',
  },

  security: {
    title: 'Seguridad y sesiones',
    description: 'Revisa dónde tienes la sesión abierta y protege tu cuenta.',
    password: {
      title: 'Contraseña',
      hint: 'Última actualización hace más de 3 meses.',
      changeButton: 'Cambiar contraseña',
    },
    sessions: {
      title: 'Sesiones activas',
      empty: 'No hay otras sesiones abiertas.',
      currentLabel: 'Esta sesión',
      lastActiveLabel: 'Última actividad',
      revokeLabel: 'Cerrar sesión',
      revokeAriaLabel: 'Cerrar la sesión de {device}',
      revokeAllButton: 'Cerrar el resto de sesiones',
    },
  },
} as const
