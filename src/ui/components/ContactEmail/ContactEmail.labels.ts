import type { Locale } from '../../../i18n/locales'
import type { ContactEmailLabels } from './ContactEmail'

/**
 * Traducciones de los textos del popover de ContactEmail.
 *
 * Viven aquí (y no en el content de cada página) porque son idénticos en los 4
 * puntos de contacto del sitio: duplicarlos por página × idioma sería repetición
 * pura. Única fuente de verdad; cada uso solo pasa su `locale`.
 */
export const CONTACT_EMAIL_LABELS: Record<Locale, ContactEmailLabels> = {
  es: {
    heading: 'Escríbenos a',
    copy: 'Copiar',
    copied: 'Copiado',
    openInGmail: 'Abrir en Gmail',
    openInOutlook: 'Abrir en Outlook',
    openInApp: 'Tu app de correo',
  },
  en: {
    heading: 'Write to us at',
    copy: 'Copy',
    copied: 'Copied',
    openInGmail: 'Open in Gmail',
    openInOutlook: 'Open in Outlook',
    openInApp: 'Your mail app',
  },
  ca: {
    heading: 'Escriu-nos a',
    copy: 'Copiar',
    copied: 'Copiat',
    openInGmail: 'Obrir a Gmail',
    openInOutlook: 'Obrir a Outlook',
    openInApp: 'La teva app de correu',
  },
}
