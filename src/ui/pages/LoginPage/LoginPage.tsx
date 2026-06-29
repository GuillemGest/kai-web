import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { authUseCases } from '../../../modules/auth/application/factory'
import { Button } from '../../components/Button/Button'
import './LoginPage.css'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    await authUseCases.login.execute(email, password)
    navigate('/cuenta')
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={handleSubmit}>
        <h1 className="login__title">Iniciar sesión</h1>
        <p className="login__hint">Prototipo: cualquier credencial inicia sesión.</p>

        <label className="login__field">
          <span className="login__label">Email</span>
          <input
            type="email"
            className="login__input"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            required
          />
        </label>

        <Button type="submit" variant="primary" size="large" className="login__submit" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}
