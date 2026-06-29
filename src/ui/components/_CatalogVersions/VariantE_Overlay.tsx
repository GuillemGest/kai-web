import type { Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'
import { SPECIALTY_TAGS } from './types'

/** Variante E — Overlay total: cards altas tipo póster, toda la info va
 *  superpuesta sobre la imagen con degradado; al hover se revela la descripción. */
export function VariantE_Overlay({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()

  return (
    <div className="catv-overlay-grid">
      {courses.map(course => {
        const spec = course.tags.find(tag => SPECIALTY_TAGS.includes(tag as never)) as Category | undefined
        const isFree = !course.precio || course.precio === '0'
        return (
          <article key={course.id} className="catv-overlay-card" onClick={() => onSelectCourse(course)}
            style={{ backgroundImage: `url('${course.linkImagen}')` }}>
            <div className="catv-overlay-scrim" />
            <div className="catv-overlay-top">
              {spec && <span className="catv-tag catv-tag--solid">{CATEGORY_LABELS[language][spec]}</span>}
              <span className="catv-price catv-price--badge">{isFree ? t.free : `${course.precio}€`}</span>
            </div>
            <div className="catv-overlay-bottom">
              <h3 className="catv-overlay-title">{loc(course.titulo)}</h3>
              <p className="catv-overlay-desc">{loc(course.descripcion)}</p>
              <button type="button" className="store-btn-primary catv-btn">{isFree ? t.acquire : `${t.buy} →`}</button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
