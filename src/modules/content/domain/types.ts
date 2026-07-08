import type { headerContent } from '../../../ui/components/Header/content/header.content.es'
import type { footerContent } from '../../../ui/components/Footer/content/footer.content.es'
import type { mainPageContent } from '../../../ui/pages/MainPage/content/mainPage.content.es'
import type { shopPageContent } from '../../../ui/pages/ShopPage/content/shopPage.content.es'
import type { planTranslations, PlanId } from '../../../ui/pages/ShopPage/content/plans.content.es'
import type { resourcesPageContent } from '../../../ui/pages/ResourcesPage/content/resourcesPage.content.es'
import type { resourceTranslations } from '../../../ui/pages/ResourcesPage/content/resources.content.es'
import type { Guide } from '../../../ui/pages/ResourcesPage/content/guides.content.es'
import type { guidePageContent } from '../../../ui/pages/GuidePage/content/guidePage.content.es'
import type { companyPageContent } from '../../../ui/pages/CompanyPage/content/companyPage.content.es'
import type { notFoundPageContent } from '../../../ui/pages/NotFoundPage/content/notFoundPage.content.es'

export type HeaderContent = typeof headerContent
export type FooterContent = typeof footerContent
export type MainPageContent = typeof mainPageContent
export type ShopPageContent = typeof shopPageContent
export type PlanTranslations = typeof planTranslations
export type { PlanId }
export type ResourcesPageContent = typeof resourcesPageContent
export type ResourceTranslations = typeof resourceTranslations
export type CategoryOrder = string[]
export type { Guide }
export type GuidePageContent = typeof guidePageContent
export type CompanyPageContent = typeof companyPageContent
export type NotFoundPageContent = typeof notFoundPageContent
