import type { Locale } from '../../../i18n/locales'
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
} from './types'

export interface ContentRepository {
  getHeader(locale: Locale): Promise<HeaderContent>
  getFooter(locale: Locale): Promise<FooterContent>
  getMainPage(locale: Locale): Promise<MainPageContent>
  getShopPage(locale: Locale): Promise<ShopPageContent>
  getPlans(locale: Locale): Promise<PlanTranslations>
  getResourcesPage(locale: Locale): Promise<ResourcesPageContent>
  getResources(
    locale: Locale,
  ): Promise<{ categoryOrder: CategoryOrder; resources: ResourceTranslations }>
  getGuides(locale: Locale): Promise<readonly Guide[]>
  getGuide(locale: Locale, slug: string | undefined): Promise<Guide | undefined>
  getGuidePage(locale: Locale): Promise<GuidePageContent>
  getCompanyPage(locale: Locale): Promise<CompanyPageContent>
  getNotFoundPage(locale: Locale): Promise<NotFoundPageContent>
}
