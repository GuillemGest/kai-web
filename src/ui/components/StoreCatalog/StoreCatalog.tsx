import type { Course, Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import { useUserCourses } from '../../contexts/UserCoursesContext'
import { formatDate } from '../../utils/dateUtils'

const SPECIALTY_TAGS = ['realtime', 'produccion-audiovisual', 'arquitectura', 'automocion'] as const

interface StoreCatalogProps {
  courses: Course[]
  total: number
  /** Fecha de adquisición (ISO) por curso: courseId → fecha. Se muestra solo en cursos adquiridos. */
  acquiredDates?: Record<number, string>
  onSelectCourse: (course: Course) => void
  onAdquirir: (course: Course) => void
  onSolicitarInfo: (course: Course) => void
}

export function StoreCardSkeleton() {
  return (
    <article className="store-card store-card--skeleton" aria-hidden>
      <div className="store-card-image-wrap">
        <div className="store-skeleton-img" />
      </div>
      <div className="store-card-body">
        <div className="store-skeleton-line store-skeleton-title" />
        <div className="store-skeleton-line store-skeleton-short" />
        <div className="store-skeleton-price" />
      </div>
      <div className="store-card-actions">
        <div className="store-skeleton-btn" />
        <div className="store-skeleton-btn" />
      </div>
    </article>
  )
}

function StoreCard({ course, acquiredDate, onSelectCourse, onAdquirir, onSolicitarInfo }: {
  course: Course
  acquiredDate?: string
  onSelectCourse: (c: Course) => void
  onAdquirir: (c: Course) => void
  onSolicitarInfo: (c: Course) => void
}) {
  const { t, loc, language } = useLocale()
  const { isEnrolled } = useUserCourses()
  const acquired = isEnrolled(course.id)
  const isFree = !course.precio || course.precio === '0'
  const acquiredLabel = acquired && acquiredDate ? `${t.acquired}: ${formatDate(acquiredDate, language)}` : null

  const specialties = course.tags.filter(tag =>
    SPECIALTY_TAGS.includes(tag as (typeof SPECIALTY_TAGS)[number])
  )
  const primarySpecialty = specialties[0] as Category | undefined

  return (
    <article
      className={`store-card${primarySpecialty ? ` store-card--${primarySpecialty}` : ''}`}
      onClick={() => onSelectCourse(course)}
    >
      <div className="store-card-image-wrap">
        <div
          className="store-card-image"
          style={{ backgroundImage: `url('${course.linkImagen}')` }}
          role="img"
          aria-label={loc(course.titulo)}
        />
        {primarySpecialty && (
          <span className={`store-card-category store-card-category--${primarySpecialty}`}>
            {CATEGORY_LABELS[language][primarySpecialty]}
          </span>
        )}
        {acquired && (
          <span className="store-card-acquired">{t.acquired}</span>
        )}
        {course.certification && (
          <img
            className="store-card-cert"
            src={
              course.certification === 'epic'
                ? `${import.meta.env.BASE_URL}certified-epic.png`
                : `${import.meta.env.BASE_URL}certified-unreal.png`
            }
            alt={`Certified ${course.certification === 'epic' ? 'Epic' : 'Unreal'}`}
          />
        )}
      </div>

      <div className="store-card-body">
        <h3 className="store-card-title">{loc(course.titulo)}</h3>
        {acquiredLabel && <p className="store-card-acquired-date">{acquiredLabel}</p>}
      </div>

      <p className="store-card-description custom-scroll">{loc(course.descripcion) || '—'}</p>

      <div className="store-card-actions">
        {!acquired && (
          <>
            <div className="store-card-price-block">
              <span className="store-card-price-label">{t.price}</span>
              <span className="store-card-price-amount">{course.precio ? <>{course.precio}<span className="store-card-price-symbol">€</span></> : t.free}</span>
              <span className="store-card-price-note">{t.priceOnce}</span>
              <button
                type="button"
                className={`store-btn-primary store-btn-full-width store-card-buy-btn${isFree ? ' store-btn-primary--green' : ''}`}
                onClick={e => { e.stopPropagation(); onAdquirir(course) }}
              >
                {isFree ? t.acquire : `${t.buy} →`}
              </button>
            </div>

            {/* <button
              type="button"
              className="store-btn-secondary store-btn-full-width"
              onClick={e => { e.stopPropagation(); onSolicitarInfo(course) }}
            >
              {t.requestInfo}
            </button> */}
          </>
        )}
        {acquired && (
          <button
            type="button"
            className="store-btn-primary store-btn-primary--green store-btn-full-width"
            onClick={() => onSelectCourse(course)}
          >
            {t.goToCourse}
          </button>
        )}
      </div>
    </article>
  )
}

export function StoreCatalog({ courses, total, acquiredDates, onSelectCourse, onAdquirir, onSolicitarInfo }: StoreCatalogProps) {
  const isLoading = total === 0 && courses.length === 0

  return (
    <div className="store-catalog">
      <p className="store-catalog-count">
        {isLoading ? ' ' : `${courses.length} curso${courses.length !== 1 ? 's' : ''}`}
      </p>

      <div className="store-grid">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <StoreCardSkeleton key={i} />)
          : courses.map(course => (
              <StoreCard
                key={course.id}
                course={course}
                acquiredDate={acquiredDates?.[course.id]}
                onSelectCourse={onSelectCourse}
                onAdquirir={onAdquirir}
                onSolicitarInfo={onSolicitarInfo}
              />
            ))
        }
      </div>

      {!isLoading && courses.length === 0 && (
        <div className="store-empty">
          <p>No hay cursos que coincidan con tu búsqueda.</p>
        </div>
      )}
    </div>
  )
}
