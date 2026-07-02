import type { Locale } from '../../../../i18n/locales'
import { accountPageContent as es } from './accountPage.content.es'
import { accountPageContent as en } from './accountPage.content.en'
import { accountPageContent as ca } from './accountPage.content.ca'

export const ACCOUNT_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>
