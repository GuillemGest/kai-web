import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Wand2, Download, Search, Play } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import { LogoMarquee } from '../../components/LogoMarquee/LogoMarquee'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { mainPageContent } from './mainPage.content'
import './MainPage.css'

const { hero, trustedBy, demo, features, faq, cta } = mainPageContent

// Iconos asociados por posición a las features del documento de contenido.
const FEATURE_ICONS = [Sparkles, Wand2, Download]

export function MainPage() {
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
              <Link to="/descargar">
                <Button variant="ghost" size="large">
                  {hero.secondaryCta}
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

      <section className="trusted" aria-labelledby="trusted-title">
        <p className="trusted__title" id="trusted-title" data-reveal>
          {trustedBy.title}
        </p>
        <LogoMarquee logos={trustedBy.logos} />
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
            <details key={q} className="faq">
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
            <Link to="/descargar">
              <Button variant="ghost" size="large">
                {cta.secondaryCta}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}