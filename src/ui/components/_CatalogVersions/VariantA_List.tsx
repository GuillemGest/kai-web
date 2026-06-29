import type { Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'
import { SPECIALTY_TAGS } from './types'

/** Variante A — Lista horizontal ancha: filas a todo el ancho, imagen a la
 *  izquierda, info al centro y precio/acción a la derecha. Densidad alta. */
export function VariantA_List({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()

  return (
    <div className="catv-list">
      {courses.map(course => {
        const spec = course.tags.find(tag => SPECIALTY_TAGS.includes(tag as never)) as Category | undefined
        const isFree = !course.precio || course.precio === '0'
        return (
          <article key={course.id} className="catv-list-row" onClick={() => onSelectCourse(course)}>
            <div className="catv-list-img" style={{ backgroundImage: `url('${course.linkImagen}')` }} />
            <div className="catv-list-main">
              {spec && <span className="catv-tag">{CATEGORY_LABELS[language][spec]}</span>}
              <h3 className="catv-list-title">{loc(course.titulo)}</h3>
              <p className="catv-list-desc">{loc(course.descripcion) || '—'}</p>
              {course.instructor && <span className="catv-list-meta">{course.instructor}</span>}
            </div>
            <div className="catv-list-side">
              <span className="catv-price">{isFree ? t.free : <>{course.precio}<span>€</span></>}</span>
              <button type="button" className="store-btn-primary catv-btn">{isFree ? t.acquire : `${t.buy} →`}</button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
