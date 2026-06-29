import type { Category, Course } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import { formatDate } from '../../utils/dateUtils'

const SPECIALTY_TAGS = ['realtime', 'produccion-audiovisual', 'arquitectura', 'automocion'] as const

interface Item {
  course: Course
  enrolledAt: string
}

interface Props {
  items: Item[]
  onSelectCourse: (course: Course) => void
}

/** Mis Cursos en formato "overlay" (póster): toda la info superpuesta sobre la
 *  imagen con degradado; al hover se revela la descripción. */
export function MisCursosOverlayGrid({ items, onSelectCourse }: Props) {
  const { t, loc, language } = useLocale()

  return (
    <div className="mc-ov-grid">
      {items.map(({ course, enrolledAt }) => {
        const spec = course.tags.find(tag =>
          SPECIALTY_TAGS.includes(tag as (typeof SPECIALTY_TAGS)[number])
        ) as Category | undefined
        return (
          <article
            key={course.id}
            className="mc-ov-card"
            style={{ backgroundImage: `url('${course.linkImagen}')` }}
            onClick={() => onSelectCourse(course)}
          >
            <div className="mc-ov-scrim" />
            <div className="mc-ov-top">
              {spec && <span className="catv-tag catv-tag--solid">{CATEGORY_LABELS[language][spec]}</span>}
              <span className="store-card-acquired">{t.acquired}</span>
            </div>
            <div className="mc-ov-bottom">
              <h3 className="mc-ov-title">{loc(course.titulo)}</h3>
              <p className="store-card-acquired-date mc-ov-date">{t.acquired}: {formatDate(enrolledAt, language)}</p>
              <p className="mc-ov-desc">{loc(course.descripcion)}</p>
              <button
                type="button"
                className="store-btn-primary store-btn-primary--green mc-ov-btn"
                onClick={e => { e.stopPropagation(); onSelectCourse(course) }}
              >
                {t.goToCourse}
              </button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
