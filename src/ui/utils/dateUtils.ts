import type { Language } from '../../domain/entities/Language'

const DATE_LOCALES: Record<Language, string> = { ca: 'ca-ES', es: 'es-ES', en: 'en-GB' }

/** Formatea una fecha ISO al locale del idioma seleccionado (formato corto). */
export function formatDate(iso: string, language: Language): string {
  return new Date(iso).toLocaleDateString(DATE_LOCALES[language])
}

export function calcDuration(start: string, end: string): string {
  const days = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 86_400_000)
  if (days <= 0) return ''
  if (days < 14) return `${days} día${days !== 1 ? 's' : ''}`
  const weeks = Math.round(days / 7)
  if (weeks < 8) return `${weeks} semana${weeks !== 1 ? 's' : ''}`
  const months = Math.round(days / 30)
  return `${months} mes${months !== 1 ? 'es' : ''}`
}
