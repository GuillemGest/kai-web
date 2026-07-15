import type { Locale } from '../../../../i18n/locales'
import { forgotPasswordPageContent as es } from './forgotPasswordPage.content.es'
import { forgotPasswordPageContent as en } from './forgotPasswordPage.content.en'
import { forgotPasswordPageContent as ca } from './forgotPasswordPage.content.ca'

export const FORGOT_PASSWORD_PAGE_CONTENT = { es, en, ca } as unknown as Record<
  Locale,
  typeof es
>
