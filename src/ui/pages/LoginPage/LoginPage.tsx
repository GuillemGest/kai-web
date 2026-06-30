import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { authUseCases } from '../../../modules/auth/application/factory'
import { Button } from '../../components/Button/Button'
import './LoginPage.css'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const motionOk = window.matchMedia('(prefers-reduced-motion: no-preference)').matches
    if (motionOk) void video.play().catch(() => {})
    else video.pause()
  }, [])

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await authUseCases.login.execute(email, password)
      navigate('/cuenta')
    } catch {
      setError('Credenciales incorrectas. Inténtalo de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      {/* Panel izquierdo — marca */}
      <div className="login__brand-panel">
        <figure className="login__video-wrap">
          <video
            ref={videoRef}
            className="login__video"
            src="/demo.mp4"
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Demostración de KAI localizando momentos clave en vídeo"
          />
        </figure>

        <div className="login__quote">
          <p className="login__quote-text">
            Encuentra los <em>momentos clave</em> sin revisar horas de metraje.
          </p>
          <p className="login__quote-meta">
            KAI indexa tu material, entiende búsquedas en lenguaje natural y exporta
            las selecciones directamente a tu editor.
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="login__form-panel">
        <form className="login__form" onSubmit={handleSubmit} noValidate>
          <h1 className="login__heading">Iniciar sesión</h1>
          <p className="login__sub">Accede a tu cuenta para continuar.</p>

          <div className="login__fields">
            <label className="login__field">
              <span className="login__label">Email</span>
              <input
                type="email"
                className="login__input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={submitting}
              />
            </label>

            <label className="login__field">
              <span className="login__label">Contraseña</span>
              <input
                type="password"
                className="login__input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                disabled={submitting}
              />
            </label>
          </div>

          {error && (
            <p className="login__error" role="alert">
              <AlertCircle size={15} strokeWidth={2} aria-hidden />
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="large"
            className="login__submit"
            disabled={submitting}
          >
            {submitting ? 'Entrando…' : 'Entrar'}
          </Button>

          <p className="login__hint">Prototipo: cualquier credencial inicia sesión.</p>
        </form>
      </div>
    </div>
  )
}
