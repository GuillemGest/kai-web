import type { Locale } from '../../../../i18n/locales'
import { checkoutPageContent as es } from './checkoutPage.content.es'
import { checkoutPageContent as en } from './checkoutPage.content.en'
import { checkoutPageContent as ca } from './checkoutPage.content.ca'

export const CHECKOUT_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>

export type CheckoutPageContent = typeof es
