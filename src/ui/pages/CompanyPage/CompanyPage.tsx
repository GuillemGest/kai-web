import type { CSSProperties } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { useLocale } from '../../../i18n/LocaleContext'
import { COMPANY_PAGE_CONTENT } from './content'
import './CompanyPage.css'

export function CompanyPage() {
  const { locale } = useLocale()
  const { hero, mission, partners } = COMPANY_PAGE_CONTENT[locale]
  useScrollReveal()

  return (
    <div className="company">
      <section className="company__hero">
        <p className="company__kicker">{hero.kicker}</p>
        <h1 className="company__title">
          {hero.titleLead}
          <span className="accent-text">{hero.titleAccent}</span>
          {hero.titleTail}
        </h1>
        <p className="company__lead">{hero.lead}</p>
      </section>

      <section className="company__mission" aria-labelledby="mission-title">
        <h2 id="mission-title" className="company__mission-title" data-reveal>
          {mission.title}
        </h2>
        <div className="company__mission-body" data-reveal>
          {mission.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="company__partners" aria-labelledby="partners-title">
        <div className="company__partners-head" data-reveal>
          <h2 id="partners-title" className="company__partners-title">
            {partners.title}
          </h2>
          <p className="company__partners-intro">{partners.intro}</p>
        </div>

        <ul className="company__partner-list">
          {partners.items.map((partner, index) => (
            <li
              key={partner.name}
              className="company__partner"
              data-reveal
              style={{ '--reveal-i': index } as CSSProperties}
            >
              <img
                src={partner.logoSrc}
                alt={partners.logoAriaLabelTemplate.replace('{name}', partner.name)}
                className="company__partner-logo"
                loading="lazy"
                decoding="async"
              />
              <div className="company__partner-text">
                <h3 className="company__partner-name">
                  {partner.name}
                  <span className="company__partner-note">{partner.note}</span>
                </h3>
                <p className="company__partner-role">{partner.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
