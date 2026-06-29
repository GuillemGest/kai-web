import type { Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'
import { SPECIALTY_TAGS } from './types'

/** Variante F — Tabla / spec sheet: vista densa y data-oriented, sin imágenes
 *  grandes. Pensada para comparar cursos rápido (precio, categoría, fechas). */
export function VariantF_Table({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()

  return (
    <div className="catv-table">
      <div className="catv-table-head">
        <span>{t.allCourses}</span>
        <span>Categoría</span>
        <span>Fechas</span>
        <span>{t.price}</span>
        <span />
      </div>
      {courses.map(course => {
        const spec = course.tags.find(tag => SPECIALTY_TAGS.includes(tag as never)) as Category | undefined
        const isFree = !course.precio || course.precio === '0'
        return (
          <div key={course.id} className="catv-table-row" onClick={() => onSelectCourse(course)}>
            <span className="catv-table-name">
              <span className="catv-table-thumb" style={{ backgroundImage: `url('${course.linkImagen}')` }} />
              {loc(course.titulo)}
            </span>
            <span className="catv-table-cat">{spec ? CATEGORY_LABELS[language][spec] : '—'}</span>
            <span className="catv-table-dates">{course.fechaInicio ?? '—'}</span>
            <span className="catv-price catv-price--sm">{isFree ? t.free : `${course.precio}€`}</span>
            <button type="button" className="store-btn-secondary catv-btn catv-btn--sm">{t.buy}</button>
          </div>
        )
      })}
    </div>
  )
}
