import type { Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'
import { SPECIALTY_TAGS } from './types'

/** Variante K — Ranking: lista editorial con un número enorme a la izquierda
 *  (1, 2, 3…) tipo "top cursos". Mucho carácter tipográfico. */
export function VariantK_Ranking({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()

  return (
    <div className="catv-rank">
      {courses.map((course, i) => {
        const spec = course.tags.find(tag => SPECIALTY_TAGS.includes(tag as never)) as Category | undefined
        const isFree = !course.precio || course.precio === '0'
        return (
          <article key={course.id} className="catv-rank-row" onClick={() => onSelectCourse(course)}>
            <span className="catv-rank-num">{String(i + 1).padStart(2, '0')}</span>
            <div className="catv-rank-img" style={{ backgroundImage: `url('${course.linkImagen}')` }} />
            <div className="catv-rank-body">
              {spec && <span className="catv-tag">{CATEGORY_LABELS[language][spec]}</span>}
              <h3 className="catv-rank-title">{loc(course.titulo)}</h3>
              <p className="catv-rank-desc">{loc(course.descripcion)}</p>
            </div>
            <span className="catv-price">{isFree ? t.free : <>{course.precio}<span>€</span></>}</span>
          </article>
        )
      })}
    </div>
  )
}
