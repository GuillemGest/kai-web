import type { Locale } from '../../../../i18n/locales'
import { checkoutThanksPageContent as es } from './checkoutThanksPage.content.es'
import { checkoutThanksPageContent as en } from './checkoutThanksPage.content.en'
import { checkoutThanksPageContent as ca } from './checkoutThanksPage.content.ca'

export const CHECKOUT_THANKS_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>

export type CheckoutThanksPageContent = typeof es
