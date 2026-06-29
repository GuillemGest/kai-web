import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { Course, Category } from '../../../domain/entities/Course'
import { CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import { useUserCourses } from '../../contexts/UserCoursesContext'
import { formatDate } from '../../utils/dateUtils'

gsap.registerPlugin(ScrollTrigger)

interface CourseCardProps {
  course: Course
  index?: number
  onSelectCourse: (course: Course) => void
  onAdquirir: (course: Course) => void
}

const SPECIALTY_TAGS = ['realtime', 'produccion-audiovisual', 'arquitectura', 'automocion'] as const

export function CourseCard({ course, index = 0, onSelectCourse, onAdquirir }: CourseCardProps) {
  const ref = useRef<HTMLElement>(null)
  const { t, loc, language } = useLocale()
  const { isEnrolled, enrolledDates } = useUserCourses()
  const acquired = isEnrolled(course.id)
  const acquiredLabel = acquired && enrolledDates[course.id]
    ? `${t.acquired}: ${formatDate(enrolledDates[course.id], language)}`
    : null

  useEffect(() => {
    const el = ref.current
    if (!el) return

    gsap.fromTo(el,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.65,
        ease: 'power3.out',
        delay: Math.min(index % 5, 4) * 0.08,
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )

    return () => { ScrollTrigger.getAll().forEach(t => t.vars.trigger === el && t.kill()) }
  }, [index])

  const isFree = !course.precio || course.precio === '0'

  const specialties = course.tags.filter(tag =>
    SPECIALTY_TAGS.includes(tag as (typeof SPECIALTY_TAGS)[number])
  )
  const primarySpecialty = specialties[0] as Category | undefined

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('.store-btn-primary') || target.closest('.store-btn-secondary')) return
    onSelectCourse(course)
  }

  return (
    <article
      ref={ref}
      className={`home-zz-row${index % 2 === 1 ? ' home-zz-row--rev' : ''}${primarySpecialty ? ` store-card--${primarySpecialty}` : ''}`}
      data-tags={course.tags.join(' ')}
      data-course-slug={course.slug}
      onClick={handleCardClick}
    >
      <div className="home-zz-img-wrap">
        <div
          className="home-zz-img"
          style={{ backgroundImage: `url('${course.linkImagen}')` }}
          role="img"
          aria-label={loc(course.titulo)}
        />
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

      <div className="home-zz-body">
        {primarySpecialty && (
          <span className={`store-card-category store-card-category--${primarySpecialty} home-zz-cat`}>
            {CATEGORY_LABELS[language][primarySpecialty]}
          </span>
        )}
        <h3 className="home-zz-title">{loc(course.titulo)}</h3>
        {acquiredLabel && <p className="store-card-acquired-date">{acquiredLabel}</p>}
        <p className="home-zz-desc">{loc(course.descripcion) || '—'}</p>

        <div className="home-zz-actions">
          {/* El bloque de precio se reserva siempre (oculto si ya está
              adquirido) para que el botón quede a la misma altura en ambos casos */}
          <div className="home-zz-price" aria-hidden={acquired} style={acquired ? { visibility: 'hidden' } : undefined}>
            <span className="store-card-price-amount">{course.precio ? <>{course.precio}<span className="store-card-price-symbol">€</span></> : t.free}</span>
            <span className="store-card-price-note">{t.priceOnce}</span>
          </div>
          {!acquired ? (
            <button
              type="button"
              className={`store-btn-primary home-zz-btn${isFree ? ' store-btn-primary--green' : ''}`}
              onClick={e => { e.stopPropagation(); onAdquirir(course) }}
            >
              {isFree ? t.acquire : `${t.buy} →`}
            </button>
          ) : (
            <button
              type="button"
              className="store-btn-primary store-btn-primary--green home-zz-btn"
              onClick={() => onSelectCourse(course)}
            >
              {t.goToCourse}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
