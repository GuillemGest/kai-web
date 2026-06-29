import { useEffect, useRef, useState } from 'react'
import type { Course } from '../../../domain/entities/Course'
import { CourseCard } from '../CourseCard/CourseCard'

interface CourseGridProps {
  courses: Course[]
  onSelectCourse: (course: Course) => void
  onAdquirir: (course: Course) => void
}

const ITEMS_PER_PAGE = 8

export function CourseGrid({ courses, onSelectCourse, onAdquirir }: CourseGridProps) {
  const [page, setPage] = useState(0)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const shouldScroll = useRef(false)

  useEffect(() => { setPage(0) }, [courses])

  useEffect(() => {
    if (shouldScroll.current && wrapperRef.current) {
      const top = wrapperRef.current.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
      shouldScroll.current = false
    }
  }, [page])

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE)
  const paginated  = courses.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE)

  const goTo = (p: number) => {
    shouldScroll.current = true
    setPage(p)
  }

  if (courses.length === 0) {
    return (
      <div className="grid-wrapper">
        <section className="home-zz">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={`home-zz-row home-zz-row--skeleton${i % 2 === 1 ? ' home-zz-row--rev' : ''}`}>
              <div className="home-zz-img-wrap"><div className="store-skeleton-img" /></div>
              <div className="home-zz-body">
                <div className="store-skeleton-line store-skeleton-title" />
                <div className="store-skeleton-line store-skeleton-short" />
                <div className="store-skeleton-price" />
              </div>
            </div>
          ))}
        </section>
      </div>
    )
  }

  return (
    <div className="grid-wrapper" ref={wrapperRef}>
      <section className="home-zz">
        {paginated.map((course, i) => (
          <CourseCard
            key={course.id}
            index={i}
            course={course}
            onSelectCourse={onSelectCourse}
            onAdquirir={onAdquirir}
          />
        ))}
      </section>

      {totalPages > 1 && (
        <div className="grid-pagination">
          <button
            type="button"
            className="grid-page-btn"
            onClick={() => goTo(page - 1)}
            disabled={page === 0}
          >
            ← Anterior
          </button>
          <span className="grid-page-info">
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="grid-page-btn"
            onClick={() => goTo(page + 1)}
            disabled={page >= totalPages - 1}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}
