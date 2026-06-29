import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'

/** Variante B — Minimalista compacta: grid denso de muchas columnas, cards
 *  solo imagen + título + precio. Pensada para ver muchos cursos de un vistazo. */
export function VariantB_Compact({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc } = useLocale()

  return (
    <div className="catv-compact-grid">
      {courses.map(course => {
        const isFree = !course.precio || course.precio === '0'
        return (
          <article key={course.id} className="catv-compact-card" onClick={() => onSelectCourse(course)}>
            <div className="catv-compact-img" style={{ backgroundImage: `url('${course.linkImagen}')` }}>
              <span className="catv-compact-price">{isFree ? t.free : `${course.precio}€`}</span>
            </div>
            <h3 className="catv-compact-title">{loc(course.titulo)}</h3>
          </article>
        )
      })}
    </div>
  )
}
