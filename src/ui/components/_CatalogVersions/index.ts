import type { ComponentType } from 'react'
import './variants.css'
import type { CatalogVariantProps } from './types'
import { VariantA_List } from './VariantA_List'
import { VariantB_Compact } from './VariantB_Compact'
import { VariantC_Grouped } from './VariantC_Grouped'
import { VariantD_Magazine } from './VariantD_Magazine'
import { VariantE_Overlay } from './VariantE_Overlay'
import { VariantF_Table } from './VariantF_Table'
import { VariantG_Carousel } from './VariantG_Carousel'
import { VariantH_Zigzag } from './VariantH_Zigzag'
import { VariantI_Masonry } from './VariantI_Masonry'
import { VariantJ_Timeline } from './VariantJ_Timeline'
import { VariantK_Ranking } from './VariantK_Ranking'
import { VariantL_Split } from './VariantL_Split'
import { VariantM_Bento } from './VariantM_Bento'
import { VariantN_Centered, VariantO_BigImage, VariantP_Compact } from './VariantTweaks'

export type { CatalogVariantProps } from './types'

/**
 * PROVISIONAL — Registro de versiones alternativas del catálogo para comparar
 * diseños. La opción "Actual" (StoreCatalog) se gestiona aparte en CoursesPage.
 */
export interface CatalogVariant {
  id: string
  label: string
  Component: ComponentType<CatalogVariantProps>
}

export const CATALOG_VARIANTS: CatalogVariant[] = [
  { id: 'a', label: 'A · Lista',     Component: VariantA_List },
  { id: 'b', label: 'B · Compacta',  Component: VariantB_Compact },
  { id: 'c', label: 'C · Grupos',    Component: VariantC_Grouped },
  { id: 'd', label: 'D · Magazine',  Component: VariantD_Magazine },
  { id: 'e', label: 'E · Overlay',   Component: VariantE_Overlay },
  { id: 'f', label: 'F · Tabla',     Component: VariantF_Table },
  { id: 'g', label: 'G · Carrusel',  Component: VariantG_Carousel },
  { id: 'h', label: 'H · Zigzag',    Component: VariantH_Zigzag },
  { id: 'i', label: 'I · Masonry',   Component: VariantI_Masonry },
  { id: 'j', label: 'J · Timeline',  Component: VariantJ_Timeline },
  { id: 'k', label: 'K · Ranking',   Component: VariantK_Ranking },
  { id: 'l', label: 'L · Split',     Component: VariantL_Split },
  { id: 'm', label: 'M · Bento',     Component: VariantM_Bento },
  { id: 'n', label: 'N · Centrada',  Component: VariantN_Centered },
  { id: 'o', label: 'O · Foto XL',   Component: VariantO_BigImage },
  { id: 'p', label: 'P · Compacta+', Component: VariantP_Compact },
]
