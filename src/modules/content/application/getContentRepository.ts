import type { ContentRepository } from '../domain/ContentRepository'
import { LocalContentRepository } from '../infrastructure/LocalContentRepository'

/**
 * Factory del ContentRepository. Por ahora siempre devuelve la implementacion local
 * (LocalContentRepository), que envuelve los content/*.content.{es,en,ca}.ts existentes.
 *
 * Preparado para leer `import.meta.env.CONTENT_SOURCE` en una fase futura, cuando exista
 * una variante WordPress (p. ej. `CONTENT_SOURCE === 'wordpress'` -> WordPressContentRepository).
 */
export function getContentRepository(): ContentRepository {
  return new LocalContentRepository()
}
