import type { Locale } from '../../../../i18n/locales'
import { loginPageContent as es } from './loginPage.content.es'
import { loginPageContent as en } from './loginPage.content.en'
import { loginPageContent as ca } from './loginPage.content.ca'

export const LOGIN_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>
