import { useDeferredValue, useEffect, useId, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Search, LifeBuoy, BookOpen, ArrowRight } from 'lucide-react'
import { resourceUseCases } from '../../../modules/resources/application/factory'
import type { Resource } from '../../../modules/resources/domain/Resource'
import { Button } from '../../components/Button/Button'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { resourcesPageContent } from './resourcesPage.content'
import { GUIDES } from './guides.content'
import './ResourcesPage.css'

const SUPPORT_EMAIL = 'soporte@kai.app'

const { head, cta, guides } = resourcesPageContent

/** Slug estable para anclar cada categoría desde el índice lateral. */
function categoryAnchor(category: string): string {
  return `cat-${category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`
}

function matchesQuery(resource: Resource, query: string): boolean {
  if (!query) return true
  const haystack = `${resource.title} ${resource.body} ${resource.category}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

export function ResourcesPage() {
  const [resources, setResources] = useState<Resource[] | null>(null)
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const searchId = useId()

  useEffect(() => {
    let active = true
    resourceUseCases.getResources.execute().then((result) => {
      if (active) setResources(result)
    })
    return () => {
      active = false
    }
  }, [])

  const groups = useMemo(() => {
    if (!resources) return []
    const filtered = resources.filter((resource) => matchesQuery(resource, deferredQuery.trim()))
    const byCategory = new Map<string, Resource[]>()
    for (const resource of filtered) {
      const list = byCategory.get(resource.category) ?? []
      list.push(resource)
      byCategory.set(resource.category, list)
    }
    return [...byCategory.entries()].map(([category, items]) => ({
      category,
      anchor: categoryAnchor(category),
      items,
    }))
  }, [resources, deferredQuery])

  const totalMatches = groups.reduce((sum, group) => sum + group.items.length, 0)
  const isLoading = resources === null
  const isEmpty = !isLoading && totalMatches === 0

  function scrollToCategory(anchor: string) {
    const target = document.getElementById(anchor)
    const container = document.querySelector('.resources__content')
    if (!target || !container) return
    container.scrollTo({ top: target.offsetTop - 16, behavior: 'smooth' })
  }

  // Re-observa al aparecer/cambiar los grupos (datos async, filtrado, estados).
  useScrollReveal([groups.length, isLoading, isEmpty])

  return (
    <div className="resources">
      <header className="resources__head">
        <div className="resources__head-copy">
          <span className="resources__badge">
            <LifeBuoy size={16} strokeWidth={2} aria-hidden />
            {head.badge}
          </span>
          <h1 className="resources__title">{head.title}</h1>
          <p className="resources__lead">{head.lead}</p>

          <div className="resources__search">
            <Search size={18} strokeWidth={2} className="resources__search-icon" aria-hidden />
            <input
              id={searchId}
              type="search"
              className="resources__search-input"
              placeholder={head.searchPlaceholder}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
              inputMode="search"
              enterKeyHint="search"
              aria-label={head.searchAriaLabel}
            />
          </div>
          <p className="resources__search-status" role="status" aria-live="polite">
            {isLoading
              ? 'Cargando recursos…'
              : query.trim()
                ? `${totalMatches} ${totalMatches === 1 ? 'resultado' : 'resultados'} para «${query.trim()}»`
                : `${totalMatches} ${totalMatches === 1 ? 'recurso' : 'recursos'} disponibles`}
          </p>
        </div>
      </header>

      <div className="resources__body">
        {!isLoading && groups.length > 1 && (
          <nav className="resources__index" aria-label="Categorías">
            <p className="resources__index-label">Categorías</p>
            <ul className="resources__index-list">
              {groups.map((group) => (
                <li key={group.anchor}>
                  <a
                    className="resources__index-link"
                    href={`#${group.anchor}`}
                    onClick={(e) => { e.preventDefault(); scrollToCategory(group.anchor) }}
                  >
                    {group.category}
                    <span className="resources__index-count">{group.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="resources__content">
          {isLoading && (
            <div className="resources__skeletons" aria-hidden>
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="resources__skeleton" />
              ))}
            </div>
          )}

          {isEmpty && (
            <div className="resources__empty">
              <Search size={28} strokeWidth={1.5} className="resources__empty-icon" aria-hidden />
              <h2 className="resources__empty-title">Sin resultados para «{query.trim()}»</h2>
              <p className="resources__empty-body">
                Prueba con otra palabra o escríbenos y te ayudamos con tu caso concreto.
              </p>
              <div className="resources__empty-actions">
                <Button variant="ghost" onClick={() => setQuery('')}>
                  Limpiar búsqueda
                </Button>
                <a href={`mailto:${SUPPORT_EMAIL}`}>
                  <Button variant="secondary">Escribir a soporte</Button>
                </a>
              </div>
            </div>
          )}

          {!isLoading &&
            !isEmpty &&
            groups.map((group, index) => (
              <section
                key={group.anchor}
                id={group.anchor}
                className="resources__group"
                data-reveal
                style={{ '--reveal-i': index } as CSSProperties}
              >
                <h2 className="resources__group-title">{group.category}</h2>
                <div className="resources__faqs">
                  {group.items.map((resource) => (
                    <details key={resource.id} className="faq">
                      <summary className="faq__q">{resource.title}</summary>
                      <p className="faq__a">{resource.body}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}

        </div>
      </div>

      {GUIDES.length > 0 && (
        <section className="resources__guides" aria-labelledby="guides-title">
          <div className="resources__guides-head" data-reveal>
            <span className="resources__badge">
              <BookOpen size={16} strokeWidth={2} aria-hidden />
              {guides.badge}
            </span>
            <h2 className="resources__guides-title" id="guides-title">
              {guides.title}
            </h2>
          </div>

          <div className="resources__guide-list">
            {GUIDES.map((guide, index) => (
              <Link
                key={guide.slug}
                to={`/recursos/guias/${guide.slug}`}
                className="resources__guide-card"
                data-reveal
                style={{ '--reveal-i': index } as CSSProperties}
              >
                <div className="resources__guide-card-text">
                  <h3 className="resources__guide-card-title">{guide.title}</h3>
                  <p className="resources__guide-card-intro">{guide.intro}</p>
                </div>
                <ArrowRight
                  size={20}
                  strokeWidth={2}
                  className="resources__guide-card-arrow"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="resources__cta">
        <div className="resources__cta-inner" data-reveal>
          <h2 className="resources__cta-title">{cta.title}</h2>
          <p className="resources__cta-lead">{cta.lead}</p>
          <a href={`mailto:${SUPPORT_EMAIL}`}>
            <Button variant="primary" size="large">
              {cta.button}
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
