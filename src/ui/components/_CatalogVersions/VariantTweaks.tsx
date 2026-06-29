import type { Category, Course } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import { useUserCourses } from '../../contexts/UserCoursesContext'
import type { CatalogVariantProps } from './types'
import { SPECIALTY_TAGS } from './types'

/**
 * Variantes "casi como la original": clonan StoreCard tal cual y solo aplican
 * una clase modificadora sobre `.store-card` para retocar tamaños / posición /
 * centrado vía CSS. Mismo grid (.store-grid) que el catálogo oficial.
 */
type Tweak = 'centered' | 'bigimg' | 'compact'

function TweakCard({ course, tweak, onSelectCourse, onAdquirir }: {
  course: Course
  tweak: Tweak
  onSelectCourse: (c: Course) => void
  onAdquirir: (c: Course) => void
}) {
  const { t, loc, language } = useLocale()
  const { isEnrolled } = useUserCourses()
  const acquired = isEnrolled(course.id)
  const isFree = !course.precio || course.precio === '0'

  const primarySpecialty = course.tags.find(tag =>
    SPECIALTY_TAGS.includes(tag as (typeof SPECIALTY_TAGS)[number])
  ) as Category | undefined

  return (
    <article
      className={`store-card catv-tweak catv-tweak--${tweak}${primarySpecialty ? ` store-card--${primarySpecialty}` : ''}`}
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
        {acquired && <span className="store-card-acquired">{t.acquired}</span>}
        {course.certification && (
          <img
            className="store-card-cert"
            src={course.certification === 'epic'
              ? `${import.meta.env.BASE_URL}certified-epic.png`
              : `${import.meta.env.BASE_URL}certified-unreal.png`}
            alt={`Certified ${course.certification === 'epic' ? 'Epic' : 'Unreal'}`}
          />
        )}
      </div>

      <div className="store-card-body">
        <h3 className="store-card-title">{loc(course.titulo)}</h3>
      </div>

      <p className="store-card-description custom-scroll">{loc(course.descripcion) || '—'}</p>

      <div className="store-card-actions">
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
      </div>
    </article>
  )
}

function makeTweakVariant(tweak: Tweak) {
  return function TweakVariant({ courses, onSelectCourse, onAdquirir }: CatalogVariantProps) {
    return (
      <div className="store-grid">
        {courses.map(course => (
          <TweakCard
            key={course.id}
            course={course}
            tweak={tweak}
            onSelectCourse={onSelectCourse}
            onAdquirir={onAdquirir}
          />
        ))}
      </div>
    )
  }
}

export const VariantN_Centered = makeTweakVariant('centered')
export const VariantO_BigImage = makeTweakVariant('bigimg')
export const VariantP_Compact = makeTweakVariant('compact')
