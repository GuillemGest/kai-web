import type { Locale } from '../../../i18n/locales'
import type { ContentRepository } from '../domain/ContentRepository'
import type {
  HeaderContent,
  FooterContent,
  MainPageContent,
  ShopPageContent,
  PlanTranslations,
  ResourcesPageContent,
  ResourceTranslations,
  CategoryOrder,
  Guide,
  GuidePageContent,
  CompanyPageContent,
  NotFoundPageContent,
} from '../domain/types'

import { HEADER_CONTENT } from '../../../ui/components/Header/content'
import { FOOTER_CONTENT } from '../../../ui/components/Footer/content'
import { MAIN_PAGE_CONTENT } from '../../../ui/pages/MainPage/content'
import { SHOP_PAGE_CONTENT, PLAN_TRANSLATIONS } from '../../../ui/pages/ShopPage/content'
import {
  RESOURCES_PAGE_CONTENT,
  GUIDES_BY_LOCALE,
  RESOURCE_TRANSLATIONS,
  findGuideBySlug,
} from '../../../ui/pages/ResourcesPage/content'
import { categoryOrderEs } from '../../../ui/pages/ResourcesPage/content/resources.content.es'
import { GUIDE_PAGE_CONTENT } from '../../../ui/pages/GuidePage/content'
import { COMPANY_PAGE_CONTENT } from '../../../ui/pages/CompanyPage/content'
import { NOT_FOUND_PAGE_CONTENT } from '../../../ui/pages/NotFoundPage/content'

/**
 * Implementacion local del ContentRepository: envuelve los `content/*.content.{es,en,ca}.ts`
 * ya existentes. Todos los ficheros de contenido ya tienen un `index.ts` que agrupa por
 * locale (HEADER_CONTENT, FOOTER_CONTENT, etc.) — se reutilizan tal cual (DRY), no se
 * reinventa el Record<Locale, X> aqui.
 *
 * `categoryOrderEs` no tiene aun variante en/ca (no existe categoryOrder.content.{en,ca}.ts),
 * asi que se usa como fallback para los 3 locales hasta que exista contenido real via WordPress.
 */
const CATEGORY_ORDER_BY_LOCALE: Record<Locale, CategoryOrder> = {
  es: categoryOrderEs,
  en: categoryOrderEs, // TODO: sustituir por categoryOrder real en ingles cuando exista
  ca: categoryOrderEs, // TODO: sustituir por categoryOrder real en catalan cuando exista
}

export class LocalContentRepository implements ContentRepository {
  async getHeader(locale: Locale): Promise<HeaderContent> {
    return HEADER_CONTENT[locale]
  }

  async getFooter(locale: Locale): Promise<FooterContent> {
    return FOOTER_CONTENT[locale]
  }

  async getMainPage(locale: Locale): Promise<MainPageContent> {
    return MAIN_PAGE_CONTENT[locale]
  }

  async getShopPage(locale: Locale): Promise<ShopPageContent> {
    return SHOP_PAGE_CONTENT[locale]
  }

  async getPlans(locale: Locale): Promise<PlanTranslations> {
    return PLAN_TRANSLATIONS[locale]
  }

  async getResourcesPage(locale: Locale): Promise<ResourcesPageContent> {
    return RESOURCES_PAGE_CONTENT[locale]
  }

  async getResources(
    locale: Locale,
  ): Promise<{ categoryOrder: CategoryOrder; resources: ResourceTranslations }> {
    return {
      categoryOrder: CATEGORY_ORDER_BY_LOCALE[locale],
      resources: RESOURCE_TRANSLATIONS[locale] as ResourceTranslations,
    }
  }

  async getGuides(locale: Locale): Promise<readonly Guide[]> {
    return GUIDES_BY_LOCALE[locale]
  }

  async getGuide(locale: Locale, slug: string | undefined): Promise<Guide | undefined> {
    return findGuideBySlug(locale, slug)
  }

  async getGuidePage(locale: Locale): Promise<GuidePageContent> {
    return GUIDE_PAGE_CONTENT[locale]
  }

  async getCompanyPage(locale: Locale): Promise<CompanyPageContent> {
    return COMPANY_PAGE_CONTENT[locale]
  }

  async getNotFoundPage(locale: Locale): Promise<NotFoundPageContent> {
    return NOT_FOUND_PAGE_CONTENT[locale]
  }
}
