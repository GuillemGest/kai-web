import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'

/** Variante J — Timeline: cursos en una línea temporal vertical ordenados por
 *  fecha de inicio. Cada hito muestra la fecha en el eje y la card al lado. */
export function VariantJ_Timeline({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc } = useLocale()

  const sorted = [...courses].sort((a, b) =>
    (a.fechaInicio ?? '9999').localeCompare(b.fechaInicio ?? '9999')
  )

  return (
    <div className="catv-timeline">
      {sorted.map(course => {
        const isFree = !course.precio || course.precio === '0'
        return (
          <div key={course.id} className="catv-tl-item">
            <div className="catv-tl-axis">
              <span className="catv-tl-date">{course.fechaInicio ?? '—'}</span>
              <span className="catv-tl-dot" />
            </div>
            <article className="catv-tl-card" onClick={() => onSelectCourse(course)}>
              <div className="catv-tl-img" style={{ backgroundImage: `url('${course.linkImagen}')` }} />
              <div className="catv-tl-body">
                <h3 className="catv-tl-title">{loc(course.titulo)}</h3>
                <p className="catv-tl-desc">{loc(course.descripcion)}</p>
                <span className="catv-price catv-price--sm">{isFree ? t.free : `${course.precio}€`}</span>
              </div>
            </article>
          </div>
        )
      })}
    </div>
  )
}
