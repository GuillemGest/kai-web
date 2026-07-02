import type { Locale } from '../../../../i18n/locales'
import { headerContent as es } from './header.content.es'
import { headerContent as en } from './header.content.en'
import { headerContent as ca } from './header.content.ca'

export const HEADER_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>
