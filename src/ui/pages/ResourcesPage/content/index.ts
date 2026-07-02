import type { Locale } from '../../../../i18n/locales'
import { resourcesPageContent as es } from './resourcesPage.content.es'
import { resourcesPageContent as en } from './resourcesPage.content.en'
import { resourcesPageContent as ca } from './resourcesPage.content.ca'
import { GUIDES as guidesEs, findGuideBySlug as findEs, type Guide } from './guides.content.es'
import { GUIDES as guidesEn, findGuideBySlug as findEn } from './guides.content.en'
import { GUIDES as guidesCa, findGuideBySlug as findCa } from './guides.content.ca'
import { resourceTranslations as resEs } from './resources.content.es'
import { resourceTranslations as resEn } from './resources.content.en'
import { resourceTranslations as resCa } from './resources.content.ca'

export const RESOURCES_PAGE_CONTENT = { es, en, ca } as unknown as Record<Locale, typeof es>

export const GUIDES_BY_LOCALE: Record<Locale, readonly Guide[]> = {
  es: guidesEs,
  en: guidesEn,
  ca: guidesCa,
}

const FINDERS: Record<Locale, typeof findEs> = { es: findEs, en: findEn, ca: findCa }

export function findGuideBySlug(locale: Locale, slug: string | undefined): Guide | undefined {
  return FINDERS[locale](slug)
}

export type ResourceTranslation = { title: string; body: string; category: string }

export const RESOURCE_TRANSLATIONS: Record<Locale, Record<string, ResourceTranslation>> = {
  es: resEs,
  en: resEn,
  ca: resCa,
}

export type { Guide }
