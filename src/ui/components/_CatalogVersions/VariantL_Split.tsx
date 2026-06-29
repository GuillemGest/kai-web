import { useState } from 'react'
import type { Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import type { CatalogVariantProps } from './types'
import { SPECIALTY_TAGS } from './types'

/** Variante L — Split 50/50: panel izquierdo sticky con el curso enfocado en
 *  grande, lista compacta a la derecha. Al pasar el ratón cambia el destacado. */
export function VariantL_Split({ courses, onSelectCourse }: CatalogVariantProps) {
  const { t, loc, language } = useLocale()
  const [focusId, setFocusId] = useState<number | null>(null)

  const focus = courses.find(c => c.id === focusId) ?? courses[0]
  if (!focus) return null

  const spec = focus.tags.find(tag => SPECIALTY_TAGS.includes(tag as never)) as Category | undefined
  const isFree = !focus.precio || focus.precio === '0'

  return (
    <div className="catv-split">
      <aside className="catv-split-feature" onClick={() => onSelectCourse(focus)}>
        <div className="catv-split-img" style={{ backgroundImage: `url('${focus.linkImagen}')` }} />
        <div className="catv-split-feature-body">
          {spec && <span className="catv-tag">{CATEGORY_LABELS[language][spec]}</span>}
          <h2 className="catv-split-feature-title">{loc(focus.titulo)}</h2>
          <p className="catv-split-feature-desc">{loc(focus.descripcion)}</p>
          <div className="catv-split-feature-actions">
            <span className="catv-price">{isFree ? t.free : <>{focus.precio}<span>€</span></>}</span>
            <button type="button" className="store-btn-primary catv-btn">{isFree ? t.acquire : `${t.buy} →`}</button>
          </div>
        </div>
      </aside>

      <ul className="catv-split-list">
        {courses.map(course => {
          const free = !course.precio || course.precio === '0'
          return (
            <li
              key={course.id}
              className={`catv-split-item${course.id === focus.id ? ' active' : ''}`}
              onMouseEnter={() => setFocusId(course.id)}
              onClick={() => onSelectCourse(course)}
            >
              <span className="catv-split-thumb" style={{ backgroundImage: `url('${course.linkImagen}')` }} />
              <span className="catv-split-item-title">{loc(course.titulo)}</span>
              <span className="catv-price catv-price--sm">{free ? t.free : `${course.precio}€`}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
