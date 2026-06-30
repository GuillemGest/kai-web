import type { CSSProperties } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, LifeBuoy } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useScrollToTop } from '../../hooks/useScrollToTop'
import { findGuideBySlug } from '../ResourcesPage/guides.content'
import './GuidePage.css'

const SUPPORT_EMAIL = 'soporte@kai.app'

export function GuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const guide = findGuideBySlug(slug)

  // Al entrar desde la lista de recursos, arrancar arriba (no heredar scroll).
  useScrollToTop()
  useScrollReveal()

  // Slug inexistente: de vuelta al centro de recursos en lugar de un 404 seco.
  if (!guide) {
    return <Navigate to="/recursos" replace />
  }

  const stepCount = guide.steps.length

  return (
    <article className="guide">
      <nav className="guide__nav" aria-label="Migas de pan">
        <Link to="/recursos" className="guide__back">
          <ArrowLeft size={16} strokeWidth={2} aria-hidden />
          Centro de recursos
        </Link>
      </nav>

      <header className="guide__head">
        <p className="guide__kicker">
          Guía · {stepCount} {stepCount === 1 ? 'paso' : 'pasos'}
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
                Paso {index + 1}
                <span className="guide__step-total"> / {stepCount}</span>
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
            <h2 className="guide__foot-title">¿Te has quedado a medias?</h2>
            <p className="guide__foot-text">
              Cuéntanos en qué punto estás y el equipo de KAI te ayuda con tu flujo concreto.
            </p>
          </div>
        </div>
        <div className="guide__foot-actions">
          <Link to="/recursos">
            <Button variant="ghost">Ver más recursos</Button>
          </Link>
          <a href={`mailto:${SUPPORT_EMAIL}`}>
            <Button variant="secondary">Contactar con soporte</Button>
          </a>
        </div>
      </aside>
    </article>
  )
}