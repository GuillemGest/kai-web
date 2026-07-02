import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Wand2, Search, Play } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useLocale } from '../../../i18n/LocaleContext'
import { MAIN_PAGE_CONTENT } from './content'
import './MainPage.css'

// Iconos asociados por posición a las features del documento de contenido.
const FEATURE_ICONS = [Sparkles, Wand2, Search]

// Logos de marca de los SO (Lucide no incluye logos de marca), por posición
// del array `compat.os` del contenido: [macOS, Windows].
const OS_ICONS = [
  <svg key="mac" className="compat__icon--apple" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.5 12.6c0-2 1.6-3 1.7-3-.9-1.4-2.4-1.6-2.9-1.6-1.2-.1-2.4.7-3 .7s-1.6-.7-2.6-.7c-1.3 0-2.6.8-3.2 2-1.4 2.4-.4 6 1 8 .7 1 1.4 2 2.4 2s1.3-.6 2.5-.6 1.5.6 2.6.6 1.6-1 2.3-1.9c.7-1 .9-2 .9-2.1 0-.1-1.9-.7-2-2.9zM14.7 6.6c.5-.7.9-1.6.8-2.6-.8 0-1.8.6-2.3 1.2-.5.6-1 1.5-.8 2.4.9.1 1.7-.4 2.3-1z" />
  </svg>,
  <svg key="win" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M3 5.5 10.5 4.4V11.5H3V5.5zM11.5 4.3 21 3v8.5h-9.5V4.3zM3 12.5h7.5v7.1L3 18.5v-6zM11.5 12.5H21V21l-9.5-1.3v-7.2z" />
  </svg>,
]

export function MainPage() {
  const { locale } = useLocale()
  const { hero, trustedBy, compat, demo, features, faq, cta } = MAIN_PAGE_CONTENT[locale]
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoFailed, setVideoFailed] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (motionOk) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [])

  useScrollReveal()

  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              {hero.titleLead}
              <span className="accent-text">{hero.titleAccent}</span>
              {hero.titleTail}
            </h1>
            <p className="hero__lead">{hero.lead}</p>
            <div className="hero__actions">
              <Link to="/planes">
                <Button variant="primary" size="large">
                  {hero.primaryCta}
                </Button>
              </Link>
            </div>
          </div>

          <figure className="hero__media">
            <video
              ref={videoRef}
              className="hero__video"
              src="/demo.mp4"
              poster="/images.jpg"
              muted
              loop
              playsInline
              preload="metadata"
              hidden={videoFailed}
              onError={() => setVideoFailed(true)}
              aria-label={hero.videoAlt}
            />
          </figure>
        </div>
      </section>

      <section className="trusted" aria-label={trustedBy.title}>
        <div className="trusted__row" data-reveal>
          <span className="trusted__label">{trustedBy.title}</span>
          <ul className="trusted__logos">
            {trustedBy.logos.map((logo) => (
              <li key={logo.src} className="trusted__item">
                <img
                  className="trusted__logo"
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  draggable={false}
                />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="demo">
        <div className="demo__inner">
          <div className="demo__copy" data-reveal>
            <h2 className="demo__title">{demo.title}</h2>
            <p className="demo__lead">{demo.lead}</p>
          </div>

          <div className="demo__stage" data-reveal>
            <span className="demo__tag">{demo.tag}</span>
            <div className="demo__prompt">
              <Search size={18} strokeWidth={2} className="demo__prompt-icon" aria-hidden />
              <span className="demo__prompt-text">{demo.query}</span>
            </div>

            <p className="demo__hint">{demo.result}</p>

            <ul className="demo__clips">
              {demo.clips.map((clip) => (
                <li key={clip.time} className="demo__clip">
                  <span className="demo__clip-thumb" aria-hidden>
                    <Play size={16} strokeWidth={2} />
                  </span>
                  <span className="demo__clip-meta">
                    <span className="demo__clip-time">{clip.time}</span>
                    <span className="demo__clip-label">{clip.label}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="compat" aria-label={compat.osLabel}>
        <div className="compat__row" data-reveal>
          <div className="compat__group">
            <span className="compat__label">{compat.osLabel}</span>
            {compat.os.map((os, i) => (
              <span key={os} className="compat__item" role="img" aria-label={os}>
                {OS_ICONS[i]}
              </span>
            ))}
          </div>

          <span className="compat__sep" aria-hidden />

          <div className="compat__group">
            <span className="compat__label">{compat.integrationLabel}</span>
            <span className="compat__item compat__item--pr">
              <img
                src="/premiereLOGO.png"
                alt={compat.integrationApp}
                className="compat__logo"
              />
            </span>
          </div>
        </div>
      </section>

      <section className="page features-section">
        <h2 className="features__heading" data-reveal>
          {features.heading}
        </h2>
        <div className="features">
          {features.items.map(({ title, body }, index) => {
            const Icon = FEATURE_ICONS[index] ?? Sparkles
            return (
              <article
                key={title}
                className={index === 0 ? 'feature feature--lead' : 'feature'}
                data-reveal
                style={{ '--reveal-i': index } as CSSProperties}
              >
                <Icon
                  size={index === 0 ? 28 : 24}
                  strokeWidth={2}
                  className="feature__icon"
                  aria-hidden
                />
                <h3 className="feature__title">{title}</h3>
                <p className="feature__body">{body}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="page faq-section">
        <h2 className="faq-section__title" data-reveal>
          {faq.title}
        </h2>
        <div className="faq-section__list" data-reveal>
          {faq.items.map(({ q, a }) => (
            <details key={q} name="faq" className="faq">
              <summary className="faq__q">{q}</summary>
              <p className="faq__a">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="cta__inner" data-reveal>
          <h2 className="cta__title">{cta.title}</h2>
          <p className="cta__lead">{cta.lead}</p>
          <div className="cta__actions">
            <Link to="/planes">
              <Button variant="primary" size="large">
                {cta.primaryCta}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}