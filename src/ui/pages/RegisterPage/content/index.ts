import type { Locale } from '../../../../i18n/locales'
import { registerPageContent as es } from './registerPage.content.es'
import { registerPageContent as en } from './registerPage.content.en'
import { registerPageContent as ca } from './registerPage.content.ca'

export const REGISTER_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>
