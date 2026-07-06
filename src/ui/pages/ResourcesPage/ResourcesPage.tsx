import { useDeferredValue, useEffect, useId, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Search, LifeBuoy, BookOpen, ArrowRight, Layers, Clock } from 'lucide-react'
import { resourceUseCases } from '../../../modules/resources/application/factory'
import type { Resource } from '../../../modules/resources/domain/Resource'
import { Button } from '../../components/Button/Button'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useLocale } from '../../../i18n/LocaleContext'
import { RESOURCES_PAGE_CONTENT, GUIDES_BY_LOCALE, RESOURCE_TRANSLATIONS } from './content'
import { Resource as ResourceEntity } from '../../../modules/resources/domain/Resource'
import './ResourcesPage.css'

/** Nº de pasos que se muestran como adelanto en la tarjeta de guía. */
const GUIDE_PREVIEW_STEPS = 3

/**
 * Estima los minutos de lectura/ejecución de una guía a partir de su nº de
 * pasos (~40s por paso, mínimo 1). Determinista: no inventa un dato externo,
 * lo deriva del contenido real para dar contexto de esfuerzo al usuario.
 */
function estimateGuideMinutes(stepCount: number): number {
  return Math.max(1, Math.round((stepCount * 40) / 60))
}

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
  const { locale } = useLocale()
  const { supportEmail, head, status, index, empty, cta, guides } = RESOURCES_PAGE_CONTENT[locale]
  const meta = guides.meta
  const localeGuides = GUIDES_BY_LOCALE[locale]
  const translations = RESOURCE_TRANSLATIONS[locale]
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

  const localizedResources = useMemo(() => {
    if (!resources) return null
    return resources.map((resource) => {
      const t = translations[resource.id]
      if (!t) return resource
      return new ResourceEntity(resource.id, resource.slug, t.title, t.body, t.category)
    })
  }, [resources, translations])

  const groups = useMemo(() => {
    if (!localizedResources) return []
    const filtered = localizedResources.filter((resource) =>
      matchesQuery(resource, deferredQuery.trim()),
    )
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
  }, [localizedResources, deferredQuery])

  const totalMatches = groups.reduce((sum, group) => sum + group.items.length, 0)
  const isLoading = resources === null
  const isEmpty = !isLoading && totalMatches === 0

  function scrollToCategory(anchor: string) {
    const target = document.getElementById(anchor)
    const container = document.querySelector<HTMLElement>('.resources__content')
    if (!target || !container) return
    // offsetTop es relativo al offsetParent (no siempre el contenedor con scroll),
    // así que calculamos la posición con rects: distancia del target al tope del scroll actual.
    const top =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      16
    container.scrollTo({ top, behavior: 'smooth' })
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
              ? status.loading
              : query.trim()
                ? (totalMatches === 1
                    ? status.resultsWithQuerySingularTemplate
                    : status.resultsWithQueryPluralTemplate
                  )
                    .replace('{count}', String(totalMatches))
                    .replace('{query}', query.trim())
                : (totalMatches === 1
                    ? status.resultsIdleSingularTemplate
                    : status.resultsIdlePluralTemplate
                  ).replace('{count}', String(totalMatches))}
          </p>
        </div>
      </header>

      <div className="resources__body">
        {!isLoading && groups.length > 1 && (
          <nav className="resources__index" aria-label={index.ariaLabel}>
            <p className="resources__index-label">{index.label}</p>
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
              <h2 className="resources__empty-title">
                {empty.titleTemplate.replace('{query}', query.trim())}
              </h2>
              <p className="resources__empty-body">{empty.body}</p>
              <div className="resources__empty-actions">
                <Button variant="ghost" onClick={() => setQuery('')}>
                  {empty.clearButton}
                </Button>
                <a href={`mailto:${supportEmail}`}>
                  <Button variant="secondary">{empty.contactButton}</Button>
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
                    <details
                      key={resource.id}
                      name={`resources-${group.anchor}`}
                      className="faq"
                    >
                      <summary className="faq__q">{resource.title}</summary>
                      <p className="faq__a">{resource.body}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}

        </div>
      </div>

      {localeGuides.length > 0 && (
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

          <ol className="resources__guide-list">
            {localeGuides.map((guide, index) => {
              const stepCount = guide.steps.length
              const minutes = estimateGuideMinutes(stepCount)
              const previewSteps = guide.steps.slice(0, GUIDE_PREVIEW_STEPS)
              const remaining = stepCount - previewSteps.length
              return (
                <li key={guide.slug} className="resources__guide-item">
                  <Link
                    to={`/recursos/guias/${guide.slug}`}
                    className="resources__guide-card"
                    data-reveal
                    style={{ '--reveal-i': index } as CSSProperties}
                    aria-label={`${guide.title} — ${meta.stepsTemplate.replace('{count}', String(stepCount))}`}
                  >
                    <div className="resources__guide-top">
                      <span className="resources__guide-ordinal" aria-hidden>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="resources__guide-meta">
                        <Layers size={13} strokeWidth={2} aria-hidden />
                        {meta.stepsTemplate.replace('{count}', String(stepCount))}
                        <span className="resources__guide-meta-sep" aria-hidden>
                          ·
                        </span>
                        <Clock size={13} strokeWidth={2} aria-hidden />
                        {meta.minutesTemplate.replace('{count}', String(minutes))}
                      </span>
                    </div>

                    <h3 className="resources__guide-card-title">{guide.title}</h3>
                    <p className="resources__guide-card-intro">{guide.intro}</p>

                    <ol className="resources__guide-steps" aria-hidden>
                      {previewSteps.map((step, stepIndex) => (
                        <li key={stepIndex} className="resources__guide-step">
                          <span className="resources__guide-step-dot">{stepIndex + 1}</span>
                          <span className="resources__guide-step-text">{step}</span>
                        </li>
                      ))}
                    </ol>

                    <span className="resources__guide-foot">
                      {remaining > 0 && (
                        <span className="resources__guide-more">
                          {meta.moreStepsTemplate.replace('{count}', String(remaining))}
                        </span>
                      )}
                      <span className="resources__guide-open">
                        {meta.open}
                        <ArrowRight
                          size={16}
                          strokeWidth={2}
                          className="resources__guide-arrow"
                          aria-hidden
                        />
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        </section>
      )}

      <section className="resources__cta">
        <div className="resources__cta-inner" data-reveal>
          <h2 className="resources__cta-title">{cta.title}</h2>
          <p className="resources__cta-lead">{cta.lead}</p>
          <a href={`mailto:${supportEmail}`}>
            <Button variant="primary" size="large">
              {cta.button}
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
