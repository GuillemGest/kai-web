import type { Locale } from '../../i18n/locales'

interface StartCardSetupParams {
  email: string
  /** Idioma actual, para que la URL de retorno de Stripe quede localizada. */
  locale: Locale
}

/**
 * Pide al endpoint SSR una sesión de Stripe (Checkout en modo `setup`) para
 * guardar una tarjeta nueva, y devuelve su URL. A diferencia de
 * `startCheckout`, NO navega la pestaña actual: el island decide abrir la URL
 * en una pestaña nueva (mismo patrón que el pago de un upgrade de plan), para
 * no perder el panel de cuenta.
 *
 * Vive en `ui/utils` (fuera de `modules/`) porque solo orquesta una llamada de
 * red desde la vista; la lógica de negocio (Customer, sesión de Stripe) está
 * en el use case `CreateCardSetupSession` del servidor.
 */
export async function startCardSetup(params: StartCardSetupParams): Promise<string> {
  const res = await fetch('/api/payment-methods/setup-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  const data = (await res.json().catch(() => null)) as { url?: string; error?: string } | null

  if (!res.ok || !data?.url) {
    throw new Error(data?.error ?? 'No se pudo iniciar el guardado de la tarjeta.')
  }

  return data.url
}
