import type { Locale } from '../../../../i18n/locales'
import { shopPageContent as es } from './shopPage.content.es'
import { shopPageContent as en } from './shopPage.content.en'
import { shopPageContent as ca } from './shopPage.content.ca'
import { planTranslations as plansEs, type PlanId } from './plans.content.es'
import { planTranslations as plansEn } from './plans.content.en'
import { planTranslations as plansCa } from './plans.content.ca'

export const SHOP_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>

export const PLAN_TRANSLATIONS = { es: plansEs, en: plansEn, ca: plansCa } as unknown as Record<
  Locale,
  typeof plansEs
>

export type { PlanId }
export type { ShopReassuranceIcon } from './shopPage.content.es'
