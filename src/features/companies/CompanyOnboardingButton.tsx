import { useCompanyOnboarding } from './useCompanyOnboarding'

interface Props {
  companyId: string
  label?: string
  className?: string
}

// Button that launches Stripe Connect onboarding for a company. Shows a loading
// state while the Edge Function runs (until the redirect) and any error inline.
export function CompanyOnboardingButton({
  companyId,
  label = 'Conectar con Stripe',
  className = 'btn-form-submit',
}: Props) {
  const { startOnboarding, loading, error } = useCompanyOnboarding()

  return (
    <div>
      <button
        type="button"
        className={className}
        disabled={loading}
        onClick={() => startOnboarding(companyId)}
      >
        {loading ? 'Redirigiendo…' : label}
      </button>
      {error && <p className="auth-error" style={{ marginTop: 8 }}>{error}</p>}
    </div>
  )
}
