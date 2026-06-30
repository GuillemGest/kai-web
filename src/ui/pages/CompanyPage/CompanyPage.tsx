import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './CompanyPage.css'

const CONTACT_EMAIL = 'hola@kai.app'

/**
 * Organizaciones reales detrás de KAI (origen + respaldo del proyecto europeo).
 * `logo` queda como hueco: sustituir el placeholder por <img src=... /> cuando
 * estén los SVG reales (ver .company__partner-logo en el CSS).
 */
const PARTNERS = [
  {
    name: 'Gestmusic',
    note: 'Banijay Entertainment',
    role: 'Origen del producto. KAI nace dentro de su equipo de producción audiovisual.',
  },
  {
    name: 'Amplify',
    note: 'Iniciativa de innovación',
    role: 'Marco desde el que se desarrolla y lleva KAI al mercado, junto a Gestmusic.',
  },
  {
    name: 'EIT Culture & Creativity',
    note: 'Apoyo del EIT — Unión Europea',
    role: 'Proyecto de innovación europeo respaldado por el Instituto Europeo de Innovación y Tecnología.',
  },
  {
    name: 'Fraunhofer IPK',
    note: 'Investigación',
    role: 'Comprensión visual avanzada: reconocimiento de personajes, interacciones y estructura narrativa.',
  },
  {
    name: 'Ugiat Technologies',
    note: 'Núcleo de IA',
    role: 'Motor de análisis de IA que indexa el material y lo hace buscable en lenguaje natural.',
  },
]

export function CompanyPage() {
  useScrollReveal()

  return (
    <div className="company">
      <section className="company__hero">
        <p className="company__kicker">Sobre KAI</p>
        <h1 className="company__title">
          Que cuentes la historia, <span className="accent-text">no que busques el clip</span>.
        </h1>
        <p className="company__lead">
          KAI nace en Gestmusic (Banijay Entertainment), dentro de la iniciativa Amplify. Construimos
          herramientas de IA para que los equipos de producción audiovisual encuentren y monten los
          mejores momentos de su material en una fracción del tiempo.
        </p>
      </section>

      <section className="company__mission" aria-labelledby="mission-title">
        <h2 id="mission-title" className="company__mission-title" data-reveal>
          Lo que tardabas horas, en segundos.
        </h2>
        <div className="company__mission-body" data-reveal>
          <p>
            Las herramientas existentes gestionan activos o editan líneas de tiempo, pero no cubren
            el proceso narrativo de principio a fin. Entre el material en bruto y la historia montada
            hay horas de revisión manual, catalogado y búsqueda.
          </p>
          <p>
            KAI cierra ese hueco: indexa el material, deja que lo explores en lenguaje natural y
            lleva las selecciones directamente a tu editor. El tiempo que ahorras vuelve a lo que
            importa — el criterio creativo.
          </p>
        </div>
      </section>

      <section className="company__partners" aria-labelledby="partners-title">
        <div className="company__partners-head" data-reveal>
          <h2 id="partners-title" className="company__partners-title">
            Quién está detrás
          </h2>
          <p className="company__partners-intro">
            KAI es un proyecto de innovación europeo. Lo desarrollan Gestmusic y Amplify con el apoyo
            de EIT Culture &amp; Creativity, e incorpora investigación y tecnología de Fraunhofer IPK
            y Ugiat Technologies.
          </p>
        </div>

        <ul className="company__partner-list">
          {PARTNERS.map((partner, index) => (
            <li
              key={partner.name}
              className="company__partner"
              data-reveal
              style={{ '--reveal-i': index } as CSSProperties}
            >
              {/* Hueco de logo: reemplazar por <img className="company__partner-logo" src=… alt=… /> */}
              <span
                className="company__partner-logo company__partner-logo--placeholder"
                role="img"
                aria-label={`Logo de ${partner.name}`}
              >
                {partner.name}
              </span>
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

      <section className="company__cta">
        <div className="company__cta-inner" data-reveal>
          <h2 className="company__cta-title">¿Hablamos?</h2>
          <p className="company__cta-lead">
            Cuéntanos en qué trabajas y te damos acceso a KAI con la configuración que encaje en tu
            flujo de producción.
          </p>
          <div className="company__cta-actions">
            <Link to="/descargar">
              <Button variant="ghost" size="large">
                Descargar KAI
              </Button>
            </Link>
            <a href={`mailto:${CONTACT_EMAIL}`}>
              <Button variant="primary" size="large">
                <Mail size={18} strokeWidth={2} aria-hidden />
                {CONTACT_EMAIL}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
