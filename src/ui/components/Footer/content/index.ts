import type { Locale } from '../../../../i18n/locales'
import { footerContent as es } from './footer.content.es'
import { footerContent as en } from './footer.content.en'
import { footerContent as ca } from './footer.content.ca'

export const FOOTER_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>
