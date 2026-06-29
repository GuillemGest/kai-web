import { useState } from 'react'
import { stripeService } from '../../infrastructure/stripe/stripeService'

// Drives the Stripe Connect onboarding flow for a company. startOnboarding
// invokes the create-connect-account Edge Function, which redirects the browser
// to Stripe's hosted onboarding — so on success this never returns.
export function useCompanyOnboarding() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startOnboarding = async (companyId: string): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      await stripeService.startConnectOnboarding(companyId)
      // Redirects on success; if we reach here without throwing, no URL came back.
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar el onboarding')
      setLoading(false)
    }
  }

  return { startOnboarding, loading, error }
}
