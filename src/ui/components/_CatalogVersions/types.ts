import type { Course } from '../../../domain/entities/Course'

/**
 * PROVISIONAL — Versiones alternativas del catálogo de cursos para comparar
 * diseños. Misma firma que StoreCatalog para poder intercambiarlas.
 * Las acciones son decorativas: aquí solo se explora la disposición visual.
 */
export interface CatalogVariantProps {
  courses: Course[]
  onSelectCourse: (course: Course) => void
  onAdquirir: (course: Course) => void
  onSolicitarInfo: (course: Course) => void
}

export const SPECIALTY_TAGS = ['realtime', 'produccion-audiovisual', 'arquitectura', 'automocion'] as const
