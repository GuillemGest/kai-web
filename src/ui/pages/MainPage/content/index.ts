import type { Locale } from '../../../../i18n/locales'
import { mainPageContent as es } from './mainPage.content.es'
import { mainPageContent as en } from './mainPage.content.en'
import { mainPageContent as ca } from './mainPage.content.ca'

export const MAIN_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>
