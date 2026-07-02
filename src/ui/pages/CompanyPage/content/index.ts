import type { Locale } from '../../../../i18n/locales'
import { companyPageContent as es } from './companyPage.content.es'
import { companyPageContent as en } from './companyPage.content.en'
import { companyPageContent as ca } from './companyPage.content.ca'

export const COMPANY_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>
