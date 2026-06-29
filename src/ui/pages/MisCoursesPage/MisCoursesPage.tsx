import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { supabase } from '../../../infrastructure/supabase/client'
import type { Course } from '../../../domain/entities/Course'
import { useAuth } from '../../contexts/AuthContext'
import { useLocale } from '../../hooks/useLocale'
import { Header } from '../../components/Header/Header'
import { Footer } from '../../components/Footer/Footer'
import { ParticleBackground } from '../../components/ParticleBackground/ParticleBackground'
import { MisCursosOverlayGrid } from './MisCursosOverlayGrid'

interface AcquiredCourse {
  enrollmentId: string
  enrolledAt: string
  course: Course
}

// Mapeador de la fila de Supabase al tipo Course del dominio
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCourse(c: any): Course {
  return {
    id:                   c.id,
    slug:                 c.slug,
    titulo:               c.title,
    descripcion:          c.description,
    descripcionExtendida: c.extended_description,
    tipoEtiqueta:         c.type_label,
    tags:                 c.tags ?? [],
    fechaInicio:          c.start_date,
    fechaFin:             c.end_date,
    linkImagen:           c.course_images?.url ?? '',
    imageId:              c.image_id ?? undefined,
    featured:             c.featured ?? false,
    precio:               c.price != null ? String(c.price) : '',
    instructor:           c.instructor ?? '',
    orden:                c.order ?? 0,
    certification:        c.certification ?? undefined,
    organizationId:       c.organization_id,
    isPublic:             c.is_public ?? false,
    isArchived:           c.is_archived ?? false,
  }
}

export function MisCoursesPage() {
  const { user, loading } = useAuth()
  const { t } = useLocale()
  const navigate = useNavigate()

  const [items, setItems] = useState<AcquiredCourse[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user) return
    setFetching(true)
    supabase
      .from('enrollments')
      .select('id, created_at, courses!course_id(*, course_images!image_id(url))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setItems(
          (data ?? []).map((row: { id: string; created_at: string; courses: unknown }) => ({
            enrollmentId: row.id,
            enrolledAt:   row.created_at,
            course:       rowToCourse(row.courses),
          }))
        )
        setFetching(false)
      })
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!loading && !user) return <Navigate to="/" replace />
  if (loading) return null

  return (
    <>
      <ParticleBackground count={80} opacity={0.4} />
      <Header />
      <main className="mis-cursos-page">
        <div className="container">
          <h1 className="mis-cursos-title">{t.myCourses}</h1>

          {fetching ? (
            <p style={{ color: 'var(--muted)' }}>Cargando…</p>
          ) : items.length === 0 ? (
            <div className="mis-cursos-empty">
              <p>{t.noAcquired}</p>
              <button type="button" className="btn-primary" onClick={() => navigate('/cursos')}>
                {t.allCourses}
              </button>
            </div>
          ) : (
            <MisCursosOverlayGrid
              items={items.map(i => ({ course: i.course, enrolledAt: i.enrolledAt }))}
              onSelectCourse={course => navigate(`/curso/${course.slug}`)}
            />
          )}

          <Footer />
        </div>
      </main>
    </>
  )
}
