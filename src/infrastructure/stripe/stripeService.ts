import { supabase } from '../supabase/client'

// supabase-js's FunctionsHttpError only exposes a generic "non-2xx status
// code" message; the actual reason our functions return (e.g. "curso no
// disponible") lives in the JSON body of error.context, the raw Response.
async function edgeFunctionErrorMessage(error: unknown, fallback: string): Promise<string> {
  const context = (error as { context?: Response } | null)?.context
  if (context && typeof context.json === 'function') {
    try {
      const body = await context.json()
      if (body?.error) return String(body.error)
    } catch {
      // body wasn't JSON, fall through to the generic message
    }
  }
  return error instanceof Error ? error.message : fallback
}

export const stripeService = {
  async startCheckout(courseId: number, courseSlug: string, userId: string, userEmail: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { courseId, courseSlug, userId, userEmail },
    })
    if (error) throw new Error(await edgeFunctionErrorMessage(error, 'Error al iniciar el pago'))
    if (!data?.url) throw new Error('No se recibió URL de pago')
    window.location.href = data.url
  },

  async verifyPayment(sessionId: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('verify-payment', {
      body: { sessionId },
    })
    if (error) throw new Error(await edgeFunctionErrorMessage(error, 'Error al verificar el pago'))
    if (!data?.ok) throw new Error(data?.error ?? 'Pago no confirmado')
  },

  // Stripe Connect: starts Express onboarding for a company (= organization) and
  // redirects the owner to the Stripe-hosted onboarding flow.
  async startConnectOnboarding(companyId: string): Promise<void> {
    const { data, error } = await supabase.functions.invoke('create-connect-account', {
      body: { companyId, siteUrl: window.location.origin },
    })
    if (error) throw new Error(await edgeFunctionErrorMessage(error, 'Error al iniciar el onboarding'))
    if (!data?.url) throw new Error('No se recibió URL de onboarding')
    window.location.href = data.url
  },

  // Stripe Connect: deletes the company's connected account and clears its
  // onboarding status, so the onboarding flow can be run again from scratch.
  async disconnectConnectAccount(companyId: string): Promise<void> {
    const { error } = await supabase.functions.invoke('disconnect-connect-account', {
      body: { companyId },
    })
    if (error) throw new Error(await edgeFunctionErrorMessage(error, 'Error al desconectar Stripe'))
  },

  // Platform-only: sets the commission charged to a company (fraction, e.g.
  // 0.05 = 5%), or null to fall back to the platform default. Enforced
  // server-side to admin_minor/admin_superior of the platform's own org.
  async updatePlatformFee(companyId: string, feePercentage: number | null): Promise<void> {
    const { error } = await supabase.functions.invoke('update-platform-fee', {
      body: { companyId, feePercentage },
    })
    if (error) throw new Error(await edgeFunctionErrorMessage(error, 'Error al guardar la comisión'))
  },
}
