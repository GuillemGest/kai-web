import type { Locale } from '../../../../i18n/locales'
import { notFoundPageContent as es } from './notFoundPage.content.es'
import { notFoundPageContent as en } from './notFoundPage.content.en'
import { notFoundPageContent as ca } from './notFoundPage.content.ca'

export const NOT_FOUND_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>
