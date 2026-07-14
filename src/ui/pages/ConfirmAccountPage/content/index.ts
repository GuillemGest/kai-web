import type { Locale } from '../../../../i18n/locales'
import { confirmAccountPageContent as es } from './confirmAccountPage.content.es'
import { confirmAccountPageContent as en } from './confirmAccountPage.content.en'
import { confirmAccountPageContent as ca } from './confirmAccountPage.content.ca'

export const CONFIRM_ACCOUNT_PAGE_CONTENT = { es, en, ca } as unknown as Record<
  Locale,
  typeof es
>
