import type { Locale } from '../../../../i18n/locales'
import { guidePageContent as es } from './guidePage.content.es'
import { guidePageContent as en } from './guidePage.content.en'
import { guidePageContent as ca } from './guidePage.content.ca'

export const GUIDE_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>
