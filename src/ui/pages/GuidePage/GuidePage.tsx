import type { CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, LifeBuoy } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useScrollToTop } from '../../hooks/useScrollToTop'
import { useLocale } from '../../../i18n/LocaleContext'
import { findGuideBySlug } from '../ResourcesPage/content'
import { GUIDE_PAGE_CONTENT } from './content'
import './GuidePage.css'

export function GuidePage() {
  const { locale } = useLocale()
  const {
    supportEmail,
    resourcesHref,
    breadcrumbAriaLabel,
    backLabel,
    kickerPrefix,
    stepWordSingular,
    stepWordPlural,
    stepLabelTemplate,
    stepTotalTemplate,
    foot,
  } = GUIDE_PAGE_CONTENT[locale]
  const { slug } = useParams<{ slug: string }>()
  const guide = findGuideBySlug(locale, slug)

  // Al entrar desde la lista de recursos, arrancar arriba (no heredar scroll).
  useScrollToTop()
  useScrollReveal()

  // Slug inexistente: de vuelta al centro de recursos en lugar de un 404 seco.
  if (!guide) {
    return <Navigate to={resourcesHref} replace />
  }

  const stepCount = guide.steps.length
  const stepWord = stepCount === 1 ? stepWordSingular : stepWordPlural

  return (
    <article className="guide">
      <nav className="guide__nav" aria-label={breadcrumbAriaLabel}>
        <Link to={resourcesHref} className="guide__back">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden />
          {backLabel}
        </Link>
      </nav>

      <header className="guide__head">
        <p className="guide__kicker">
          {kickerPrefix}
          {stepCount} {stepWord}
        </p>
        <h1 className="guide__title">{guide.title}</h1>
        <p className="guide__intro">{guide.intro}</p>
      </header>

      <ol className="guide__steps">
        {guide.steps.map((step, index) => (
          <li
            key={index}
            className="guide__step"
            data-reveal
            style={{ '--reveal-i': index } as CSSProperties}
          >
            <span className="guide__step-num" aria-hidden>
              {index + 1}
            </span>
            <div className="guide__step-body">
              <span className="guide__step-label">
                {stepLabelTemplate.replace('{n}', String(index + 1))}
                <span className="guide__step-total">
                  {stepTotalTemplate.replace('{total}', String(stepCount))}
                </span>
              </span>
              <p className="guide__step-text">{step}</p>
            </div>
          </li>
        ))}
      </ol>

      <aside className="guide__foot" data-reveal>
        <div className="guide__foot-copy">
          <LifeBuoy size={20} strokeWidth={2} className="guide__foot-icon" aria-hidden />
          <div>
            <h2 className="guide__foot-title">{foot.title}</h2>
            <p className="guide__foot-text">{foot.text}</p>
          </div>
        </div>
        <div className="guide__foot-actions">
          <Link to={resourcesHref}>
            <Button variant="ghost">{foot.moreResourcesLabel}</Button>
          </Link>
          <a href={`mailto:${supportEmail}`}>
            <Button variant="secondary">{foot.contactLabel}</Button>
          </a>
        </div>
      </aside>
    </article>
  )
}
