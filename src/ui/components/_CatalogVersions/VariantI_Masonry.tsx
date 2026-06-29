import type { Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'
import { SPECIALTY_TAGS } from './types'

/** Variante I — Masonry: columnas tipo Pinterest con alturas de imagen
 *  variables según el índice, generando un ritmo irregular y orgánico. */
export function VariantI_Masonry({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()
  const heights = [200, 280, 240, 320, 180, 260]

  return (
    <div className="catv-masonry">
      {courses.map((course, i) => {
        const spec = course.tags.find(tag => SPECIALTY_TAGS.includes(tag as never)) as Category | undefined
        const isFree = !course.precio || course.precio === '0'
        return (
          <article key={course.id} className="catv-masonry-card" onClick={() => onSelectCourse(course)}>
            <div
              className="catv-masonry-img"
              style={{ backgroundImage: `url('${course.linkImagen}')`, height: heights[i % heights.length] }}
            />
            <div className="catv-masonry-body">
              {spec && <span className="catv-tag">{CATEGORY_LABELS[language][spec]}</span>}
              <h3 className="catv-masonry-title">{loc(course.titulo)}</h3>
              <span className="catv-price catv-price--sm">{isFree ? t.free : `${course.precio}€`}</span>
            </div>
          </article>
        )
      })}
    </div>
  )
}
