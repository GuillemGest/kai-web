import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { companyRepository } from '../../infrastructure/db'
import { useAuth } from '../../ui/contexts/AuthContext'
import { Header } from '../../ui/components/Header/Header'
import { ParticleBackground } from '../../ui/components/ParticleBackground/ParticleBackground'
import { CompanyOnboardingButton } from './CompanyOnboardingButton'

// Landing page for the return from Stripe Connect onboarding. Serves both
// /onboarding/complete and /onboarding/retry. It reads companyId from the query
// string (appended by the create-connect-account function) and checks the
// company's onboarding status via the companies (organizations) table.
//
// Note: onboarding completion is confirmed asynchronously by the
// stripe-connect-webhook (account.updated → charges_enabled). The company row
// may still read incomplete here if the webhook hasn't landed yet, so we offer a
// retry/refresh path either way.
export function OnboardingReturn() {
  const [params] = useSearchParams()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { loading: authLoading } = useAuth()
  const companyId = params.get('companyId')
  const isRetryRoute = pathname.includes('/onboarding/retry')

  const [status, setStatus] = useState<'checking' | 'complete' | 'incomplete' | 'error'>('checking')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!companyId) {
      setStatus('error')
      setErrorMsg('No se encontró la empresa.')
      return
    }
    // Esperar a que la sesión de auth esté rehidratada: getById lee
    // organizations bajo RLS (organizations_read), que requiere un usuario
    // autenticado y miembro de la empresa. Al volver de Stripe la sesión tarda
    // un instante en cargarse.
    if (authLoading) return

    let cancelled = false

    // Red de seguridad: nunca dejar el spinner colgado indefinidamente.
    const safety = setTimeout(() => {
      if (!cancelled) {
        setStatus((prev) => (prev === 'checking' ? 'incomplete' : prev))
      }
    }, 8000)

    companyRepository.getById(companyId)
      .then((company) => {
        if (cancelled) return
        if (!company) {
          // Sin fila legible (p. ej. RLS no la deja ver): tratar como pendiente,
          // con opción de reintentar, en lugar de un error duro.
          setStatus('incomplete')
          return
        }
        setStatus(company.stripeOnboardingComplete ? 'complete' : 'incomplete')
      })
      .catch((err) => {
        if (cancelled) return
        setStatus('error')
        setErrorMsg(err instanceof Error ? err.message : 'Error al comprobar el onboarding')
      })
      .finally(() => clearTimeout(safety))

    return () => { cancelled = true; clearTimeout(safety) }
  }, [companyId, authLoading])

  return (
    <>
      <ParticleBackground count={120} opacity={0.5} />
      <Header />
      <main className="payment-success-page">
        <div className="payment-success-card">
          {status === 'checking' && (
            <>
              <div className="payment-success-spinner" />
              <p className="payment-success-msg">Comprobando el estado del onboarding…</p>
            </>
          )}

          {status === 'complete' && (
            <>
              <div className="payment-success-icon">✓</div>
              <h1 className="payment-success-title">Onboarding completado</h1>
              <p className="payment-success-msg">Ya puedes vender cursos: los pagos se enviarán a tu cuenta de Stripe.</p>
              <div className="payment-success-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                  Volver al inicio
                </button>
              </div>
            </>
          )}

          {status === 'incomplete' && (
            <>
              <div className="payment-success-icon error">!</div>
              <h1 className="payment-success-title">Onboarding pendiente</h1>
              <p className="payment-success-msg" style={{ color: 'var(--muted)' }}>
                {isRetryRoute
                  ? 'El proceso no se completó. Puedes retomarlo cuando quieras.'
                  : 'Aún estamos confirmando tu cuenta de Stripe. Si acabas de terminar, espera unos segundos y vuelve a comprobarlo, o retoma el proceso.'}
              </p>
              <div className="payment-success-actions">
                {companyId && <CompanyOnboardingButton companyId={companyId} label="Continuar onboarding" />}
                <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                  Volver al inicio
                </button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="payment-success-icon error">!</div>
              <h1 className="payment-success-title">Algo fue mal</h1>
              <p className="payment-success-msg" style={{ color: 'var(--muted)' }}>{errorMsg}</p>
              <div className="payment-success-actions">
                <button type="button" className="btn-secondary" onClick={() => navigate('/')}>
                  Volver al inicio
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
