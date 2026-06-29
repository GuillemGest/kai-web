import type { Category } from '../../../domain/entities/Course'
import { CATEGORIES, CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'

/** Variante C — Agrupado por especialidad: una sección por categoría con
 *  cabecera, y dentro un grid. Útil cuando hay catálogo amplio y heterogéneo. */
export function VariantC_Grouped({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()

  const groups = CATEGORIES
    .map(cat => ({ cat, items: courses.filter(c => c.tags.includes(cat)) }))
    .filter(g => g.items.length > 0)

  return (
    <div className="catv-grouped">
      {groups.map(({ cat, items }) => (
        <section key={cat} className="catv-group">
          <header className={`catv-group-head catv-group-head--${cat}`}>
            <h2 className="catv-group-title">{CATEGORY_LABELS[language][cat as Category]}</h2>
            <span className="catv-group-count">{items.length}</span>
          </header>
          <div className="catv-group-grid">
            {items.map(course => {
              const isFree = !course.precio || course.precio === '0'
              return (
                <article key={course.id} className="catv-group-card" onClick={() => onSelectCourse(course)}>
                  <div className="catv-group-img" style={{ backgroundImage: `url('${course.linkImagen}')` }} />
                  <div className="catv-group-body">
                    <h3 className="catv-group-card-title">{loc(course.titulo)}</h3>
                    <span className="catv-price catv-price--sm">{isFree ? t.free : `${course.precio}€`}</span>
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
