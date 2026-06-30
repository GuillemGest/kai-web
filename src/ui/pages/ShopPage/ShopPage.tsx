import { useEffect, useState, type CSSProperties } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ShieldCheck, CreditCard, Headset, Info } from 'lucide-react'
import { billingUseCases } from '../../../modules/billing/application/factory'
import type { Plan } from '../../../modules/billing/domain/Plan'
import { PlanCard } from '../../components/PlanCard/PlanCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './ShopPage.css'

type LoadState = 'loading' | 'ready' | 'error'

const REASSURANCE = [
  { icon: ShieldCheck, text: 'Sin permanencia, cancela cuando quieras' },
  { icon: CreditCard, text: 'Facturación mensual, sin sorpresas' },
  { icon: Headset, text: 'Soporte por personas, no bots' },
]

const FAQS = [
  {
    q: '¿Puedo cambiar de plan más adelante?',
    a: 'Sí. Puedes subir o bajar de plan en cualquier momento desde tu cuenta; el cambio se prorratea en la siguiente factura.',
  },
  {
    q: '¿Hay permanencia o compromiso anual?',
    a: 'No. Todos los planes son mensuales y puedes cancelar cuando quieras. Sigues teniendo acceso hasta el final del periodo pagado.',
  },
  {
    q: '¿Los precios incluyen IVA?',
    a: 'Los precios se muestran sin IVA. El impuesto aplicable se calcula en el checkout según tu país y datos de facturación.',
  },
  {
    q: '¿Qué pasa si supero las horas de vídeo de mi plan?',
    a: 'Te avisamos antes de llegar al límite. Puedes esperar al siguiente ciclo o subir de plan al instante para seguir trabajando.',
  },
  {
    q: '¿Necesito tarjeta para empezar?',
    a: 'Para suscribirte sí. El plugin se descarga gratis; la suscripción activa la búsqueda con IA y la exportación.',
  },
]

export function ShopPage() {
  const navigate = useNavigate()
  const [plans, setPlans] = useState<Plan[]>([])
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    let active = true
    billingUseCases.getPlans
      .execute()
      .then((result) => {
        if (!active) return
        setPlans(result)
        setState('ready')
      })
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [])

  const handleSelect = (plan: Plan) => {
    navigate(`/login?plan=${plan.id}`)
  }

  // Re-observa al pasar a 'ready' (la zona inferior es estable, pero el reveal
  // se inicializa una vez montado el contenido principal).
  useScrollReveal([state])

  return (
    <div className="shop">
      <header className="shop__head">
        <h1 className="shop__title">Elige el plan que va con tu ritmo</h1>
        <p className="shop__lead">
          Suscripción mensual con el plugin KAI y todas sus actualizaciones. Empieza pequeño y sube
          de plan cuando tu volumen de vídeo lo pida.
        </p>
        <p className="shop__notice">
          <Info size={15} strokeWidth={2} aria-hidden />
          Precios orientativos; el importe definitivo se confirma en el checkout.
        </p>
      </header>

      {state === 'loading' && (
        <div className="plans-grid" aria-hidden>
          {[0, 1, 2].map((i) => (
            <div key={i} className="plan-skeleton" />
          ))}
        </div>
      )}

      {state === 'error' && (
        <div className="shop__error" role="alert">
          <p>No hemos podido cargar los planes.</p>
          <button
            type="button"
            className="shop__retry"
            onClick={() => {
              setState('loading')
              billingUseCases.getPlans
                .execute()
                .then((result) => {
                  setPlans(result)
                  setState('ready')
                })
                .catch(() => setState('error'))
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {state === 'ready' && plans.length > 0 && (
        <ul className="plans-grid">
          {plans.map((plan, i) => (
            <li key={plan.id} className="plans-grid__item" style={{ '--i': i } as CSSProperties}>
              <PlanCard plan={plan} onSelect={handleSelect} />
            </li>
          ))}
        </ul>
      )}

      {state === 'ready' && plans.length === 0 && (
        <div className="shop__empty">
          <p>Aún no hay planes disponibles.</p>
          <p className="shop__empty-hint">
            Escríbenos y te contamos las opciones que mejor encajan con tu producción.
          </p>
          <Link to="/recursos" className="shop__empty-link">
            Hablar con nosotros
          </Link>
        </div>
      )}

      <ul className="shop__reassurance" data-reveal>
        {REASSURANCE.map(({ icon: Icon, text }) => (
          <li key={text} className="shop__reassurance-item">
            <Icon size={18} strokeWidth={2} aria-hidden />
            {text}
          </li>
        ))}
      </ul>

      <section className="shop__faq">
        <h2 className="shop__faq-title" data-reveal>
          Preguntas frecuentes
        </h2>
        <div className="shop__faq-list" data-reveal>
          {FAQS.map(({ q, a }) => (
            <details key={q} className="faq">
              <summary className="faq__q">{q}</summary>
              <p className="faq__a">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
