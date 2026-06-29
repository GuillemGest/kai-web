// Receives Stripe Connect webhooks. On `account.updated`, fetches the fresh
// account from the Stripe API (the event payload may be a "thin" summary that
// doesn't embed charges_enabled) and, if charges_enabled === true, marks the
// owning organization's stripe_onboarding_complete = true. Runs with the
// service-role key.
//
// Signature is verified manually (Web Crypto HMAC-SHA256) against
// STRIPE_WEBHOOK_SECRET, using the RAW request body. Server-to-server: no CORS.

const STRIPE_WEBHOOK_SECRET = () => Deno.env.get('STRIPE_WEBHOOK_SECRET')!
const STRIPE_SECRET_KEY = () => Deno.env.get('STRIPE_SECRET_KEY')!
const SUPABASE_URL = () => Deno.env.get('SUPABASE_URL')!
const SUPABASE_KEY = () => Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

async function stripeGetAccount(accountId: string): Promise<{ id: string; charges_enabled: boolean }> {
  const res = await fetch(`https://api.stripe.com/v1/accounts/${accountId}`, {
    headers: { 'Authorization': `Bearer ${STRIPE_SECRET_KEY()}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Stripe error')
  return json
}

// The account id can show up in different shapes depending on the event's
// payload style (full snapshot vs thin summary).
function extractAccountId(event: Record<string, unknown>): string | null {
  const data = event.data as Record<string, unknown> | undefined
  const obj = data?.object
  if (typeof obj === 'string') return obj
  if (obj && typeof obj === 'object' && typeof (obj as Record<string, unknown>).id === 'string') {
    return (obj as Record<string, unknown>).id as string
  }
  const related = event.related_object as Record<string, unknown> | undefined
  if (related && typeof related.id === 'string') return related.id as string
  return null
}

async function supabasePatch(table: string, query: string, body: Record<string, unknown>) {
  const res = await fetch(`${SUPABASE_URL()}/rest/v1/${table}?${query}`, {
    method: 'PATCH',
    headers: {
      'apikey': SUPABASE_KEY(),
      'Authorization': `Bearer ${SUPABASE_KEY()}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(JSON.stringify(err))
  }
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return result === 0
}

// Verifies the Stripe-Signature header (scheme: t=<ts>,v1=<sig>) over `${t}.${payload}`.
async function verifyStripeSignature(payload: string, sigHeader: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(
    sigHeader.split(',').map((p) => p.split('=') as [string, string]),
  )
  const timestamp = parts['t']
  const signature = parts['v1']
  if (!timestamp || !signature) return false

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const mac = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(`${timestamp}.${payload}`),
  )
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')

  return timingSafeEqual(expected, signature)
}

Deno.serve(async (req) => {
  // Raw body is required for signature verification — read it before parsing.
  const payload = await req.text()
  const sig = req.headers.get('stripe-signature')

  try {
    if (!sig || !(await verifyStripeSignature(payload, sig, STRIPE_WEBHOOK_SECRET()))) {
      return new Response(JSON.stringify({ error: 'Firma inválida' }), { status: 400 })
    }

    const event = JSON.parse(payload)

    if (event.type === 'account.updated' || event.type === 'v1.account.updated') {
      const accountId = extractAccountId(event)
      if (accountId) {
        const account = await stripeGetAccount(accountId)
        if (account.charges_enabled === true) {
          await supabasePatch(
            'organizations',
            `stripe_account_id=eq.${accountId}`,
            { stripe_onboarding_complete: true },
          )
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(String(err))
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
