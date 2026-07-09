import type { Subscription } from '../../../../modules/billing/domain/Subscription'
import type { InvoiceStatus } from '../../../../modules/billing/domain/Invoice'
import type { TeamRole, MemberStatus } from '../../../../modules/team/domain/TeamMember'

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
        refunded: 'Reembolsada',
      } satisfies Record<InvoiceStatus, string>,
    },
  },

  team: {
    title: 'Administración del equipo',
    description: 'Miembros de tu organización y asientos de tu plan.',
    seatsUsed: 'asientos en uso',
    seatsOf: 'de',
    inviteButton: 'Invitar a alguien',
    memberColumn: 'Miembro',
    roleColumn: 'Rol',
    statusColumn: 'Estado',
    joinedColumn: 'Desde',
    manageAria: 'Gestionar a {name}',
    roleLabels: {
      owner: 'Propietario',
      admin: 'Administrador',
      editor: 'Editor',
    } satisfies Record<TeamRole, string>,
    statusLabels: {
      active: 'Activo',
      invited: 'Invitación pendiente',
    } satisfies Record<MemberStatus, string>,
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
