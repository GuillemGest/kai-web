import type { Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'
import { SPECIALTY_TAGS } from './types'

// Patrón de tamaños que se repite: grande, ancha, normal, normal, alta, normal
const SIZES = ['lg', 'wide', '', '', 'tall', ''] as const

/** Variante M — Bento asimétrico: mosaico real con cards de distintos tamaños
 *  (grande, ancha, alta, normal) siguiendo un patrón que se repite. */
export function VariantM_Bento({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()

  return (
    <div className="catv-bento">
      {courses.map((course, i) => {
        const size = SIZES[i % SIZES.length]
        const spec = course.tags.find(tag => SPECIALTY_TAGS.includes(tag as never)) as Category | undefined
        const isFree = !course.precio || course.precio === '0'
        return (
          <article
            key={course.id}
            className={`catv-bento-card${size ? ` catv-bento-card--${size}` : ''}`}
            onClick={() => onSelectCourse(course)}
            style={{ backgroundImage: `url('${course.linkImagen}')` }}
          >
            <div className="catv-bento-scrim" />
            <div className="catv-bento-content">
              {spec && <span className="catv-tag catv-tag--solid">{CATEGORY_LABELS[language][spec]}</span>}
              <div className="catv-bento-foot">
                <h3 className="catv-bento-title">{loc(course.titulo)}</h3>
                <span className="catv-price catv-price--badge">{isFree ? t.free : `${course.precio}€`}</span>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
