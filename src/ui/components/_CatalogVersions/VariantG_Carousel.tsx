import type { Category } from '../../../domain/entities/Course'
import { CATEGORIES, CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'

/** Variante G — Carruseles por categoría (estilo streaming): cada categoría es
 *  una fila con scroll horizontal de cards. Bueno para explorar por temas. */
export function VariantG_Carousel({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()

  const rows = CATEGORIES
    .map(cat => ({ cat, items: courses.filter(c => c.tags.includes(cat)) }))
    .filter(r => r.items.length > 0)

  return (
    <div className="catv-carousel">
      {rows.map(({ cat, items }) => (
        <section key={cat} className="catv-carousel-row">
          <h2 className="catv-carousel-title">{CATEGORY_LABELS[language][cat as Category]}</h2>
          <div className="catv-carousel-track custom-scroll">
            {items.map(course => {
              const isFree = !course.precio || course.precio === '0'
              return (
                <article key={course.id} className="catv-carousel-card" onClick={() => onSelectCourse(course)}>
                  <div className="catv-carousel-img" style={{ backgroundImage: `url('${course.linkImagen}')` }} />
                  <div className="catv-carousel-body">
                    <h3 className="catv-carousel-card-title">{loc(course.titulo)}</h3>
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
