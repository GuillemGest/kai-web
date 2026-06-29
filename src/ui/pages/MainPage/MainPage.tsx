import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, Wand2, Download, Search, Play } from 'lucide-react'
import { Button } from '../../components/Button/Button'
import './MainPage.css'

const CLIPS = [
  { time: '00:12', label: 'Habla del rodaje nocturno' },
  { time: '04:03', label: 'Anécdota del set' },
  { time: '21:47', label: 'Cómo preparó el papel' },
  { time: '08:55', label: 'Mensaje al equipo' },
]

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

const FAQS = [
  {
    q: '¿Qué es KAI y cómo funciona?',
    a: 'KAI es una plataforma de narración basada en inteligencia artificial diseñada para ayudar a los equipos creativos a convertir grandes volúmenes de material audiovisual en historias finalizadas más rápidamente. Funciona conectando tres pasos en un solo flujo de trabajo: indexar los materiales, crear historias mediante lenguaje natural y enviar las historias generadas directamente a la línea de tiempo de edición. En segundo plano, KAI enriquece el material con inteligencia estructurada —transcripciones, descripciones de escenas, señales emocionales y momentos narrativos clave— para que los equipos puedan buscar, explorar y construir narrativas de forma colaborativa.',
  },
  {
    q: '¿Qué problemas resuelve KAI?',
    a: 'KAI resuelve un vacío que las herramientas existentes no cubren por completo: pueden gestionar activos o editar líneas temporales, pero no integran todo el proceso narrativo de principio a fin. KAI reduce el tiempo y el esfuerzo de la revisión manual, la catalogación, la búsqueda y la preparación de estructuras narrativas: permite buscar entre el material filmado, construir historias de forma colaborativa mediante lenguaje natural y llevar los resultados directamente a la herramienta de edición, para que los editores se centren en el toque creativo final.',
  },
  {
    q: '¿Se integra con mi sistema de edición?',
    a: 'Sí. KAI conecta la narración directamente mediante integración nativa con herramientas de edición no lineal (NLE). Las historias, selecciones y estructuras narrativas creadas en KAI se llevan directamente a la línea de tiempo de edición.',
  },
  {
    q: '¿Qué organizaciones participan en KAI?',
    a: 'KAI ha sido desarrollado conjuntamente por Gestmusic y Amplify dentro de un proyecto de innovación europeo apoyado por EIT Culture & Creativity, que cuenta con el respaldo del Instituto Europeo de Innovación y Tecnología (EIT), un organismo de la Unión Europea. El proyecto incluye la colaboración en investigación de Fraunhofer IPK —que aporta conocimientos avanzados en comprensión visual para un reconocimiento más profundo de personajes, interacciones y estructuras narrativas— e incorpora un núcleo de análisis de IA avanzado desarrollado por Ugiat Technologies, S.L.',
  },
  {
    q: '¿Cómo puedo utilizar KAI?',
    a: 'Ponte en contacto con nosotros y te daremos acceso a la plataforma y te guiaremos en la mejor configuración para tu flujo de trabajo. KAI se ofrece mediante licencias y suscripciones flexibles, diseñadas para adaptarse a la duración, intensidad y necesidades de cada producción.',
  },
]

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

  return (
    <>
      <section className="hero">
        <div className="hero__inner">
          <div className="hero__copy">
            <h1 className="hero__title">
              El asistente de IA que encuentra los <span className="accent-text">momentos clave</span>{' '}
              de tus vídeos
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
              aria-label="KAI localizando los momentos clave dentro de una línea de tiempo de vídeo"
            />
          </figure>
        </div>
      </section>

      <section className="demo">
        <div className="demo__inner">
          <div className="demo__copy">
            <h2 className="demo__title">
              Pídelo con tus palabras. KAI te devuelve los clips exactos.
            </h2>
            <p className="demo__lead">
              Sin revisar horas de metraje ni etiquetar a mano. Describes lo que buscas y KAI recorre
              todo tu material para devolverte solo los fragmentos relevantes, listos para montar.
            </p>
          </div>

          <div className="demo__stage">
            <span className="demo__tag">Ejemplo</span>
            <div className="demo__prompt">
              <Search size={18} strokeWidth={2} className="demo__prompt-icon" aria-hidden />
              <span className="demo__prompt-text">la entrevista donde habla del rodaje</span>
            </div>

            <p className="demo__hint">KAI encuentra 4 momentos en 3,2&nbsp;s</p>

            <ul className="demo__clips">
              {CLIPS.map((clip) => (
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
        <h2 className="features__heading">Todo lo que necesitas para ir más rápido</h2>
        <div className="features">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="feature">
              <Icon size={24} strokeWidth={2} className="feature__icon" aria-hidden />
              <h3 className="feature__title">{title}</h3>
              <p className="feature__body">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page faq-section">
        <h2 className="faq-section__title">Preguntas frecuentes</h2>
        <div className="faq-section__list">
          {FAQS.map(({ q, a }) => (
            <details key={q} className="faq">
              <summary className="faq__q">{q}</summary>
              <p className="faq__a">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta">
        <div className="cta__inner">
          <h2 className="cta__title">Empieza a crear con KAI</h2>
          <p className="cta__lead">
            Suscríbete, descarga el plugin y deja que KAI haga el trabajo pesado por ti.
          </p>
          <div className="cta__actions">
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
    </>
  )
}
