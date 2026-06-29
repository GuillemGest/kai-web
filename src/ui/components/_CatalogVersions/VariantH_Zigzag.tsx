import type { Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'
import { SPECIALTY_TAGS } from './types'

/** Variante H — Zigzag editorial: una card por fila a todo el ancho, con la
 *  imagen y el texto alternando lados. Muy visual, pocos cursos por pantalla. */
export function VariantH_Zigzag({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()

  return (
    <div className="catv-zigzag">
      {courses.map((course, i) => {
        const spec = course.tags.find(tag => SPECIALTY_TAGS.includes(tag as never)) as Category | undefined
        const isFree = !course.precio || course.precio === '0'
        return (
          <article
            key={course.id}
            className={`catv-zigzag-row${i % 2 === 1 ? ' catv-zigzag-row--rev' : ''}`}
            onClick={() => onSelectCourse(course)}
          >
            <div className="catv-zigzag-img" style={{ backgroundImage: `url('${course.linkImagen}')` }} />
            <div className="catv-zigzag-body">
              {spec && <span className="catv-tag">{CATEGORY_LABELS[language][spec]}</span>}
              <h3 className="catv-zigzag-title">{loc(course.titulo)}</h3>
              <p className="catv-zigzag-desc">{loc(course.descripcion)}</p>
              <div className="catv-zigzag-actions">
                <span className="catv-price">{isFree ? t.free : <>{course.precio}<span>€</span></>}</span>
                <button type="button" className="store-btn-primary catv-btn">{isFree ? t.acquire : `${t.buy} →`}</button>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
