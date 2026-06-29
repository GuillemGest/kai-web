import { Link } from 'react-router-dom'
import { Sparkles, Wand2, Download } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import './MainPage.css'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Encuentra momentos al instante',
    body: 'Pídele a KAI lo que buscas en lenguaje natural y localiza los clips relevantes en segundos.',
  },
  {
    icon: Wand2,
    title: 'Organiza y edita',
    body: 'Arrastra, ordena y ajusta tu playlist de clips desde un editor pensado para ir rápido.',
  },
  {
    icon: Download,
    title: 'Exporta donde trabajas',
    body: 'KAI funciona como plugin e integra el resultado directamente en tu flujo de trabajo.',
  },
]

export function MainPage() {
  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <h1 className="hero__title">
            El asistente de IA que encuentra los <span className="accent-text">momentos clave</span> de
            tus vídeos
          </h1>
          <p className="hero__lead">
            KAI es un plugin que busca, organiza y exporta los mejores fragmentos de tu material en
            una fracción del tiempo. Suscríbete y empieza a crear.
          </p>
          <div className="hero__actions">
            <Link to="/planes">
              <Button variant="primary" size="large">
                Ver planes
              </Button>
            </Link>
            <Link to="/descargar">
              <Button variant="ghost" size="large">
                Descargar
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="page">
        <div className="features">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="feature">
              <Icon size={24} strokeWidth={2} className="feature__icon" aria-hidden />
              <h2 className="feature__title">{title}</h2>
              <p className="feature__body">{body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
