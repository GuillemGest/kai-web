import { useEffect, useState } from 'react'
import type { Course, Category } from '../../../domain/entities/Course'
import { CATEGORIES, CATEGORY_LABELS } from '../../../domain/entities/Course'
import { useLocale } from '../../hooks/useLocale'
import { useUserCourses } from '../../contexts/UserCoursesContext'

interface Props {
  courses: Course[]
  showAcquired: boolean
  onShowAcquiredChange: (value: boolean) => void
  showOwnershipSwitch: boolean
  onFilter: (filtered: Course[]) => void
}

export function CourseFilterBar({ courses, showAcquired, onShowAcquiredChange, showOwnershipSwitch, onFilter }: Props) {
  const { t, loc, language } = useLocale()
  const { isEnrolled } = useUserCourses()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | ''>('')

  // showAcquired OFF → solo no adquiridos; ON → todos
  const apply = (q: string, cat: Category | '', includeOwned: boolean) => {
    const q2 = q.toLowerCase()
    onFilter(courses.filter(c => {
      const matchSearch = !q2 || loc(c.titulo).toLowerCase().includes(q2)
      const matchCat = !cat || c.tags.includes(cat)
      const matchOwn = includeOwned || !isEnrolled(c.id)
      return matchSearch && matchCat && matchOwn
    }))
  }

  // Re-aplica al cambiar el switch o al llegar los cursos
  useEffect(() => {
    apply(search, category, showAcquired)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAcquired, courses])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    apply(e.target.value, category, showAcquired)
  }

  const handleCategory = (cat: Category | '') => {
    setCategory(cat)
    apply(search, cat, showAcquired)
  }

  return (
    <div className="course-filter-bar">
      <input
        className="course-filter-search"
        type="search"
        placeholder="Buscar curso…"
        value={search}
        onChange={handleSearch}
      />
      <div className="course-filter-row">
        <div className="course-filter-cats">
          <button
            type="button"
            className={`course-filter-cat${category === '' ? ' active' : ''}`}
            onClick={() => handleCategory('')}
          >
            Todos
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              type="button"
              className={`course-filter-cat${category === cat ? ' active' : ''}`}
              onClick={() => handleCategory(cat)}
            >
              {CATEGORY_LABELS[language][cat]}
            </button>
          ))}
        </div>

        {showOwnershipSwitch && (
          <label className="course-ownership-switch">
            <span className="course-ownership-switch-label">{t.filterShowAcquired}</span>
            <input
              type="checkbox"
              checked={showAcquired}
              onChange={e => onShowAcquiredChange(e.target.checked)}
            />
            <span className="course-ownership-switch-track" aria-hidden>
              <span className="course-ownership-switch-thumb" />
            </span>
          </label>
        )}
      </div>
    </div>
  )
}
