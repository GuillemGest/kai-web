import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import { Apple, Monitor, Terminal, Download as DownloadIcon, Lock } from 'lucide-react'
import { downloadsUseCases } from '../../../modules/downloads/application/factory'
import type { DownloadBuild, OperatingSystem } from '../../../modules/downloads/domain/DownloadBuild'
import { authUseCases } from '../../../modules/auth/application/factory'
import { billingUseCases } from '../../../modules/billing/application/factory'
import { Button } from '../../components/Button/Button'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import './DownloadPage.css'

type LoadState = 'loading' | 'ready' | 'error'

/**
 * Acceso a la descarga, compuesto en la UI a partir de dos módulos:
 * - 'anonymous': sin sesión iniciada.
 * - 'inactive': con sesión, pero sin suscripción activa.
 * - 'allowed': con sesión y suscripción activa → puede descargar.
 */
type Access = 'loading' | 'anonymous' | 'inactive' | 'allowed'

const OS_META: Record<OperatingSystem, { label: string; icon: typeof Apple }> = {
  windows: { label: 'Windows', icon: Monitor },
  macos: { label: 'macOS', icon: Apple },
  linux: { label: 'Linux', icon: Terminal },
}

const STEPS = [
  'Instala el plugin con el archivo que acabas de descargar.',
  'Abre tu editor de vídeo y activa KAI desde el gestor de plugins.',
  'Inicia sesión con tu suscripción y empieza a buscar momentos.',
]

function detectOS(): OperatingSystem | null {
  if (typeof navigator === 'undefined') return null
  const ua = `${navigator.userAgent} ${navigator.platform}`.toLowerCase()
  if (ua.includes('win')) return 'windows'
  if (ua.includes('mac') || ua.includes('iphone') || ua.includes('ipad')) return 'macos'
  if (ua.includes('linux') || ua.includes('android') || ua.includes('x11')) return 'linux'
  return null
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(new Date(iso))
}

export function DownloadPage() {
  const [builds, setBuilds] = useState<DownloadBuild[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const [access, setAccess] = useState<Access>('loading')
  const detected = useMemo(detectOS, [])

  useEffect(() => {
    let active = true
    downloadsUseCases.getDownloads
      .execute('kai')
      .then((result) => {
        if (!active) return
        setBuilds(result)
        setState('ready')
      })
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [])

  // Gate de descarga: sesión iniciada + suscripción activa.
  useEffect(() => {
    let active = true
    async function resolveAccess() {
      const user = await authUseCases.getCurrentUser.execute()
      if (!active) return
      if (!user) {
        setAccess('anonymous')
        return
      }
      const subscription = await billingUseCases.getCurrentSubscription.execute(user.id)
      if (!active) return
      setAccess(subscription?.isActive ? 'allowed' : 'inactive')
    }
    resolveAccess().catch(() => active && setAccess('anonymous'))
    return () => {
      active = false
    }
  }, [])

  const canDownload = access === 'allowed'
  const primary = builds.find((b) => b.os === detected) ?? null
  const others = builds.filter((b) => b !== primary)

  // Re-observa cuando cambian los estados de carga (el contenido aparece async).
  useScrollReveal([state, access])

  return (
    <div className="download">
      <header className="download__head">
        <h1 className="download__title">Descarga KAI e instálalo en minutos</h1>
        <p className="download__lead">
          El plugin es gratuito; necesitarás una suscripción activa para usar la búsqueda con IA y la
          exportación tras la instalación.
        </p>
      </header>

      {state === 'loading' && (
        <div className="download__primary download__primary--skeleton" aria-hidden />
      )}

      {state === 'error' && (
        <div className="download__error" role="alert">
          <p>No hemos podido cargar las descargas.</p>
          <button
            type="button"
            className="download__retry"
            onClick={() => {
              setState('loading')
              downloadsUseCases.getDownloads
                .execute('kai')
                .then((result) => {
                  setBuilds(result)
                  setState('ready')
                })
                .catch(() => setState('error'))
            }}
          >
            Reintentar
          </button>
        </div>
      )}

      {access !== 'loading' && access !== 'allowed' && <DownloadGate access={access} />}

      {state === 'ready' && (
        <>
          {primary && <PrimaryDownload build={primary} canDownload={canDownload} />}

          {others.length > 0 && (
            <section className="download__others">
              <h2 className="download__others-title">
                {primary ? 'Para otros sistemas' : 'Elige tu sistema operativo'}
              </h2>
              <ul className="download__os-list">
                {others.map((build) => {
                  const meta = OS_META[build.os]
                  const Icon = meta.icon
                  return (
                    <li key={build.id} className="os-row">
                      <Icon size={22} strokeWidth={2} className="os-row__icon" aria-hidden />
                      <span className="os-row__meta">
                        <span className="os-row__name">{meta.label}</span>
                        <span className="os-row__version">
                          v{build.version} · {formatDate(build.releasedAt)}
                        </span>
                      </span>
                      {canDownload ? (
                        <a className="os-row__link" href={build.fileUrl} download>
                          Descargar
                        </a>
                      ) : (
                        <span className="os-row__link os-row__link--locked" aria-disabled="true">
                          <Lock size={14} strokeWidth={2} aria-hidden />
                          Bloqueado
                        </span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </>
      )}

      <section className="download__steps">
        <h2 className="download__steps-title" data-reveal>
          Después de descargar
        </h2>
        <ol className="steps">
          {STEPS.map((step, i) => (
            <li
              key={step}
              className="step"
              data-reveal
              style={{ '--reveal-i': i } as CSSProperties}
            >
              <span className="step__num" aria-hidden>
                {i + 1}
              </span>
              <p className="step__text">{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function PrimaryDownload({ build, canDownload }: { build: DownloadBuild; canDownload: boolean }) {
  const meta = OS_META[build.os]
  const Icon = meta.icon
  return (
    <section className="download__primary">
      <Icon size={32} strokeWidth={2} className="download__primary-icon" aria-hidden />
      <div className="download__primary-info">
        <p className="download__primary-eyebrow">Detectamos tu sistema</p>
        <h2 className="download__primary-os">KAI para {meta.label}</h2>
        <p className="download__primary-meta">
          Versión {build.version} · publicado el {formatDate(build.releasedAt)}
        </p>
      </div>
      {canDownload ? (
        <a href={build.fileUrl} download className="download__primary-cta">
          <Button variant="primary" size="large">
            <DownloadIcon size={18} strokeWidth={2} aria-hidden />
            Descargar para {meta.label}
          </Button>
        </a>
      ) : (
        <div className="download__primary-cta">
          <Button variant="primary" size="large" disabled>
            <Lock size={18} strokeWidth={2} aria-hidden />
            Descarga bloqueada
          </Button>
        </div>
      )}
    </section>
  )
}

function DownloadGate({ access }: { access: 'anonymous' | 'inactive' }) {
  const isAnon = access === 'anonymous'
  return (
    <section className="download__gate" role="status">
      <span className="download__gate-icon" aria-hidden>
        <Lock size={20} strokeWidth={2} />
      </span>
      <div className="download__gate-body">
        <h2 className="download__gate-title">
          {isAnon ? 'Inicia sesión para descargar' : 'Activa tu suscripción para descargar'}
        </h2>
        <p className="download__gate-text">
          {isAnon
            ? 'La descarga de KAI está disponible para cuentas con una suscripción activa.'
            : 'Tu cuenta no tiene una suscripción activa. Elige un plan para desbloquear la descarga.'}
        </p>
      </div>
      <Link to={isAnon ? '/login?next=/descargar' : '/planes'} className="download__gate-cta">
        <Button variant="primary" size="large">
          {isAnon ? 'Iniciar sesión' : 'Ver planes'}
        </Button>
      </Link>
    </section>
  )
}
