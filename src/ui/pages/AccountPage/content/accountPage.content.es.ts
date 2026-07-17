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
      endsAtLabel: 'Acaba el',
      pendingChangeLabel: 'Cambiará a {plan} el {date}',
      changePlanButton: 'Cambiar de plan',
      cancelButton: 'Cancelar suscripción',
      reactivateButton: 'Reanudar suscripción',
      /** Botón único que abre el hub de administración (cambiar / cancelar / reanudar). */
      manageButton: 'Administrar suscripción',
      statusLabels: {
        active: 'Activa',
        canceled: 'Cancelada',
        past_due: 'Pago pendiente',
        none: 'Sin suscripción',
      } satisfies Record<Subscription['status'], string>,
      /** Hub del modal "Administrar suscripción": resumen + dos acciones. */
      manageDialog: {
        title: 'Administrar suscripción',
        changeDesc: 'Sube o baja de plan',
        cancelDesc: 'Deja de renovarse al final de este periodo',
        reactivateDesc: 'Vuelve a activar la renovación automática',
        backLabel: 'Atrás',
        continueLabel: 'Continuar',
        newPlanLabel: 'Plan nuevo',
        newPriceLabel: 'Precio nuevo',
      },
      /** Diálogo de cancelación (baja a fin de periodo), en dos pasos: revisión + confirmación final. */
      cancelDialog: {
        title: 'Cancelar suscripción',
        body: '¿Seguro que quieres cancelar {plan}? Seguirás teniendo acceso hasta el {date}; a partir de esa fecha no se renovará y perderás el acceso. No se hace ningún cargo ni reembolso ahora.',
        finalNote: 'Esta acción no se puede deshacer desde este paso: podrás reanudar la suscripción en cualquier momento antes de la fecha de fin.',
        confirm: 'Sí, cancelar',
        cancel: 'No, mantener',
        success: 'Tu suscripción se cancelará el {date}.',
      },
      /** Diálogo de reactivación (revertir baja programada), en dos pasos. */
      reactivateDialog: {
        title: 'Reanudar suscripción',
        body: 'Tu suscripción a {plan} volverá a renovarse con normalidad el {date}.',
        finalNote: 'Se reanudará la renovación automática y se cobrará el importe habitual en la próxima fecha de renovación.',
        confirm: 'Reanudar',
        cancel: 'Cerrar',
        success: 'Tu suscripción vuelve a estar activa.',
      },
      /** Diálogo de cambio de plan. */
      changeDialog: {
        title: 'Cambiar de plan',
        intro: 'Elige el plan al que quieres cambiar. Las mejoras se aplican al momento cobrando solo la diferencia de este mes; las bajadas se aplican en la próxima renovación.',
        currentBadge: 'Plan actual',
        upgradeNote: 'Mejora: se abrirá una pestaña para confirmar el cobro de la diferencia prorrateada de este periodo (ahí también puedes cambiar la tarjeta). Esta pantalla se actualizará sola cuando termines.',
        downgradeNote: 'Bajada: sigues con {plan} hasta el {date} y el nuevo plan entra en la siguiente renovación.',
        confirm: 'Confirmar cambio',
        confirmUpgrade: 'Continuar al pago',
        cancel: 'Cancelar',
        successNow: 'Plan cambiado. El nuevo plan ya está activo.',
        successLater: 'Cambio programado: entrará en vigor el {date}.',
      },
      genericError: 'No se pudo completar la operación. Inténtalo de nuevo.',
      pricePeriodMonth: '/mes',
    },
    paymentMethod: {
      title: 'Método de pago',
      hint: 'La tarjeta predeterminada es la que se usa para cobrar la renovación de tu suscripción.',
      empty: 'No has añadido ningún método de pago.',
      expiresLabel: 'Caduca',
      defaultLabel: 'Predeterminada',
      makeDefaultButton: 'Usar para cobros',
      addCardButton: 'Añadir tarjeta',
      /** Se abre en pestaña nueva; este texto es breve porque no bloquea la interfaz. */
      addingCardButton: 'Abriendo…',
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
