import { useDeferredValue, useId, useMemo, useState, type CSSProperties } from 'react'
import { Search } from 'lucide-react'
import { Button } from '../components/Button/Button'
import { ContactEmail } from '../components/ContactEmail/ContactEmail'
import { CONTACT_EMAIL_LABELS } from '../components/ContactEmail/ContactEmail.labels'
import { CONTACT_EMAILS } from '../../config/appUrls'
import type { Locale } from '../../i18n/locales'
import type { ResourcesPageContent, ResourceTranslations } from '../../modules/content/domain/types'

interface ResourceItem {
  id: string
  title: string
  body: string
  category: string
}

function matchesQuery(resource: ResourceItem, query: string): boolean {
  if (!query) return true
  const haystack = `${resource.title} ${resource.body} ${resource.category}`.toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term))
}

/** Slug estable para anclar cada categoria desde el indice lateral. */
function categoryAnchor(category: string): string {
  return `cat-${category
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`
}

interface ResourcesSearchProps {
  content: ResourcesPageContent
  resources: ResourceTranslations
  categoryOrder: string[]
  locale: Locale
}

export function ResourcesSearch({ content, resources, categoryOrder, locale }: ResourcesSearchProps) {
  const { head, status, index, empty } = content
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const searchId = useId()

  const items = useMemo<ResourceItem[]>(
    () =>
      Object.entries(resources).map(([id, r]) => ({
        id,
        title: r.title,
        body: r.body,
        category: r.category,
      })),
    [resources],
  )

  const groups = useMemo(() => {
    const filtered = items.filter((resource) => matchesQuery(resource, deferredQuery.trim()))
    const byCategory = new Map<string, ResourceItem[]>()
    for (const resource of filtered) {
      const list = byCategory.get(resource.category) ?? []
      list.push(resource)
      byCategory.set(resource.category, list)
    }
    const ordered = [...byCategory.entries()].sort((a, b) => {
      const ai = categoryOrder.indexOf(a[0])
      const bi = categoryOrder.indexOf(b[0])
      if (ai === -1 && bi === -1) return 0
      if (ai === -1) return 1
      if (bi === -1) return -1
      return ai - bi
    })
    return ordered.map(([category, groupItems]) => ({
      category,
      anchor: categoryAnchor(category),
      items: groupItems,
    }))
  }, [items, deferredQuery, categoryOrder])

  const totalMatches = groups.reduce((sum, group) => sum + group.items.length, 0)
  const isEmpty = totalMatches === 0

  function scrollToCategory(anchor: string) {
    const target = document.getElementById(anchor)
    const container = document.querySelector<HTMLElement>('.resources__content')
    if (!target || !container) return
    const top =
      target.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop -
      16
    container.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <>
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
        {query.trim()
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

      <div className="resources__body">
        {groups.length > 1 && (
          <nav className="resources__index" aria-label={index.ariaLabel}>
            <p className="resources__index-label">{index.label}</p>
            <ul className="resources__index-list">
              {groups.map((group) => (
                <li key={group.anchor}>
                  <a
                    className="resources__index-link"
                    href={`#${group.anchor}`}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToCategory(group.anchor)
                    }}
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
                <ContactEmail
                  email={CONTACT_EMAILS.support}
                  variant="secondary"
                  labels={CONTACT_EMAIL_LABELS[locale]}
                >
                  {empty.contactButton}
                </ContactEmail>
              </div>
            </div>
          )}

          {!isEmpty &&
            groups.map((group, groupIndex) => (
              <section
                key={group.anchor}
                id={group.anchor}
                className="resources__group"
                data-reveal
                style={{ '--reveal-i': groupIndex } as CSSProperties}
              >
                <h2 className="resources__group-title">{group.category}</h2>
                <div className="resources__faqs">
                  {group.items.map((resource) => (
                    <details key={resource.id} name={`resources-${group.anchor}`} className="faq">
                      <summary className="faq__q">{resource.title}</summary>
                      <p className="faq__a">{resource.body}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
        </div>
      </div>
    </>
  )
}
