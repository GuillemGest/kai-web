import type { Locale } from '../../../../i18n/locales'
import { resetPasswordPageContent as es } from './resetPasswordPage.content.es'
import { resetPasswordPageContent as en } from './resetPasswordPage.content.en'
import { resetPasswordPageContent as ca } from './resetPasswordPage.content.ca'

export const RESET_PASSWORD_PAGE_CONTENT = { es, en, ca } as unknown as Record<
  Locale,
  typeof es
>
