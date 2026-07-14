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
      changePlanButton: 'Canvia de pla',
      statusLabels: {
        active: 'Activa',
        canceled: 'Cancel·lada',
        past_due: 'Pagament pendent',
        none: 'Sense subscripció',
      } satisfies Record<Subscription['status'], string>,
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
