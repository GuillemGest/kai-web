import type { Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'
import { SPECIALTY_TAGS } from './types'

/** Variante D — Magazine: el primer curso ocupa un hero grande con la info
 *  superpuesta; el resto va en un grid pequeño de apoyo. Editorial. */
export function VariantD_Magazine({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()
  if (courses.length === 0) return null

  const [hero, ...rest] = courses
  const heroSpec = hero.tags.find(tag => SPECIALTY_TAGS.includes(tag as never)) as Category | undefined
  const heroFree = !hero.precio || hero.precio === '0'

  return (
    <div className="catv-mag">
      <article className="catv-mag-hero" onClick={() => onSelectCourse(hero)}
        style={{ backgroundImage: `linear-gradient(to top, rgba(8,9,11,0.95) 10%, rgba(8,9,11,0.25) 60%, transparent), url('${hero.linkImagen}')` }}>
        <div className="catv-mag-hero-content">
          {heroSpec && <span className="catv-tag">{CATEGORY_LABELS[language][heroSpec]}</span>}
          <h2 className="catv-mag-hero-title">{loc(hero.titulo)}</h2>
          <p className="catv-mag-hero-desc">{loc(hero.descripcion)}</p>
          <div className="catv-mag-hero-actions">
            <span className="catv-price">{heroFree ? t.free : <>{hero.precio}<span>€</span></>}</span>
            <button type="button" className="store-btn-primary catv-btn">{heroFree ? t.acquire : `${t.buy} →`}</button>
          </div>
        </div>
      </article>

      <div className="catv-mag-grid">
        {rest.map(course => {
          const isFree = !course.precio || course.precio === '0'
          return (
            <article key={course.id} className="catv-mag-card" onClick={() => onSelectCourse(course)}>
              <div className="catv-mag-card-img" style={{ backgroundImage: `url('${course.linkImagen}')` }} />
              <div className="catv-mag-card-body">
                <h3 className="catv-mag-card-title">{loc(course.titulo)}</h3>
                <span className="catv-price catv-price--sm">{isFree ? t.free : `${course.precio}€`}</span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
