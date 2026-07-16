import type { Subscription } from '../../../../modules/billing/domain/Subscription'
import type { InvoiceStatus } from '../../../../modules/billing/domain/Invoice'

/**
 * Traducció al català (ca) del contingut del tauler "El meu compte".
 */
export const accountPageContent = {
  locale: 'ca-ES',

  title: 'El meu compte',
  subtitle: 'Gestiona el teu perfil, la subscripció, l’equip i la seguretat.',
  notLoggedIn: 'No has iniciat sessió.',
  logoutButton: 'Tanca la sessió',

  /**
   * Avís de prova gratis iniciada. Es mostra en arribar al compte amb
   * ?trial=started (després d’entrar des del chip "Prova gratis" de plans).
   * Només aparença: de moment no es persisteix cap estat de prova.
   */
  trialBanner: {
    title: 'La teva prova gratis ha començat',
    text: 'Tens 15 dies per provar KAI sense cost. Descarrega el plugin i comença a trobar els teus millors moments.',
    dismissLabel: 'Tanca l’avís',
  },

  nav: {
    account: 'Compte',
    billing: 'Facturació',
    team: 'Administració',
    security: 'Seguretat',
  },

  account: {
    title: 'Informació del compte',
    description: 'Les dades amb què identifiquem el teu compte de KAI.',
    nameLabel: 'Nom',
    emailLabel: 'Correu electrònic',
    memberSinceLabel: 'Membre des de',
    languageLabel: 'Idioma preferit',
    editButton: 'Edita el perfil',
    changePasswordButton: 'Canvia la contrasenya',
  },

  billing: {
    title: 'Facturació',
    description: 'El teu pla actual, el mètode de pagament i les factures.',
    plan: {
      title: 'Pla actual',
      empty: 'No tens cap subscripció activa.',
      statusLabel: 'Estat',
      planLabel: 'Pla',
      renewsAtLabel: 'Es renova el',
      canceledAtLabel: 'Finalitza el',
      endsAtLabel: 'Acaba el',
      pendingChangeLabel: 'Canviarà a {plan} el {date}',
      changePlanButton: 'Canvia de pla',
      cancelButton: 'Cancel·la la subscripció',
      reactivateButton: 'Reprèn la subscripció',
      manageButton: 'Administra la subscripció',
      statusLabels: {
        active: 'Activa',
        canceled: 'Cancel·lada',
        past_due: 'Pagament pendent',
        none: 'Sense subscripció',
      } satisfies Record<Subscription['status'], string>,
      manageDialog: {
        title: 'Administra la subscripció',
        changeDesc: 'Puja o baixa de pla',
        cancelDesc: 'Deixa de renovar-se en acabar aquest període',
        reactivateDesc: 'Torna a activar la renovació automàtica',
        backLabel: 'Enrere',
      },
      cancelDialog: {
        title: 'Cancel·la la subscripció',
        body: 'Segur que vols cancel·lar {plan}? Mantindràs l’accés fins al {date}; a partir d’aquesta data no es renovarà i perdràs l’accés. Ara no es fa cap càrrec ni cap reemborsament.',
        confirm: 'Sí, cancel·la',
        cancel: 'No, mantén-la',
        success: 'La teva subscripció es cancel·larà el {date}.',
      },
      reactivateDialog: {
        title: 'Reprèn la subscripció',
        body: 'La teva subscripció a {plan} tornarà a renovar-se amb normalitat el {date}.',
        confirm: 'Reprèn',
        cancel: 'Tanca',
        success: 'La teva subscripció torna a estar activa.',
      },
      changeDialog: {
        title: 'Canvia de pla',
        intro: 'Tria el pla al qual vols canviar. Les millores s’apliquen al moment cobrant només la diferència d’aquest mes; les baixades s’apliquen en la propera renovació.',
        currentBadge: 'Pla actual',
        upgradeNote: 'Millora: s’aplica ja i es cobra només la diferència prorratejada d’aquest període.',
        downgradeNote: 'Baixada: continues amb {plan} fins al {date} i el nou pla entra en la propera renovació.',
        confirm: 'Confirma el canvi',
        cancel: 'Cancel·la',
        successNow: 'Pla canviat. El nou pla ja està actiu.',
        successLater: 'Canvi programat: entrarà en vigor el {date}.',
      },
      genericError: 'No s’ha pogut completar l’operació. Torna-ho a provar.',
      pricePeriodMonth: '/mes',
    },
    paymentMethod: {
      title: 'Mètode de pagament',
      empty: 'No has afegit cap mètode de pagament.',
      expiresLabel: 'Caduca',
      updateButton: 'Actualitza la targeta',
    },
    invoices: {
      title: 'Historial de factures',
      empty: 'Encara no hi ha factures.',
      numberLabel: 'Factura',
      dateLabel: 'Data',
      amountLabel: 'Import',
      statusLabel: 'Estat',
      downloadLabel: 'Descarrega el PDF',
      downloadAriaLabel: 'Descarrega la factura {number} en PDF',
      statusLabels: {
        paid: 'Pagada',
        open: 'Pendent',
        void: 'Anul·lada',
        uncollectible: 'Impagada',
        refunded: 'Reemborsada',
      } satisfies Record<InvoiceStatus, string>,
    },
  },

  team: {
    title: 'Administració d’usuaris',
    description: 'Usuaris de cada organització de la plataforma.',
    inviteButton: 'Convida algú',
    organizationLabel: 'Organització',
    usersInOrg: 'usuaris en aquesta organització',
    emptyUsers: 'No hi ha usuaris per mostrar.',
    fullAdminLabel: 'Administrador',
  },

  security: {
    title: 'Seguretat i sessions',
    description: 'Revisa on tens la sessió oberta i protegeix el teu compte.',
    password: {
      title: 'Contrasenya',
      hint: 'Última actualització fa més de 3 mesos.',
      changeButton: 'Canvia la contrasenya',
    },
    sessions: {
      title: 'Sessions actives',
      empty: 'No hi ha altres sessions obertes.',
      currentLabel: 'Aquesta sessió',
      lastActiveLabel: 'Última activitat',
      revokeLabel: 'Tanca la sessió',
      revokeAriaLabel: 'Tanca la sessió de {device}',
      revokeAllButton: 'Tanca la resta de sessions',
    },
  },
} as const
