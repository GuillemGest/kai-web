// Creates (or reuses) a Stripe Express connected account for a company
// (= organization) and returns a fresh onboarding URL. The stripe_account_id is
// persisted to the organizations table. Runs with the service-role key (bypasses RLS).

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STRIPE_KEY = () => Deno.env.get('STRIPE_SECRET_KEY')!
const SUPABASE_URL = () => Deno.env.get('SUPABASE_URL')!
const SUPABASE_KEY = () => Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

async function stripePost(path: string, body: Record<string, string>) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_KEY()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message ?? 'Stripe error')
  return json
}

async function supabaseGet(table: string, query: string) {
  const res = await fetch(`${SUPABASE_URL()}/rest/v1/${table}?${query}`, {
    headers: {
      'apikey': SUPABASE_KEY(),
      'Authorization': `Bearer ${SUPABASE_KEY()}`,
    },
  })
  return res.json()
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

// Only trust a client-supplied siteUrl if it points at localhost (dev) or the
// configured production host; anything else falls back to SITE_URL to avoid
// turning this into an open redirect.
function resolveSiteUrl(requestedSiteUrl: unknown): string {
  const fallback = Deno.env.get('SITE_URL') ?? 'http://localhost:5173'
  if (typeof requestedSiteUrl !== 'string') return fallback
  try {
    const requested = new URL(requestedSiteUrl)
    const allowedHosts = new Set(['localhost', '127.0.0.1', new URL(fallback).hostname])
    if (allowedHosts.has(requested.hostname)) return requested.origin
  } catch {
    // ignore malformed URLs, use fallback
  }
  return fallback
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const { companyId, siteUrl: requestedSiteUrl } = await req.json()
    if (!companyId) {
      return new Response(JSON.stringify({ error: 'Falta companyId' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const orgs = await supabaseGet('organizations', `id=eq.${companyId}&select=id,name,stripe_account_id&limit=1`)
    const org = orgs?.[0]
    if (!org) {
      return new Response(JSON.stringify({ error: 'Empresa no encontrada' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Reuse the existing connected account if there is one, otherwise create it.
    let accountId: string = org.stripe_account_id
    if (!accountId) {
      const account = await stripePost('/accounts', { type: 'express' })
      accountId = account.id
      await supabasePatch('organizations', `id=eq.${companyId}`, { stripe_account_id: accountId })
    }

    const siteUrl = resolveSiteUrl(requestedSiteUrl)
    const accountLink = await stripePost('/account_links', {
      account:     accountId,
      refresh_url: `${siteUrl}/onboarding/retry?companyId=${companyId}`,
      return_url:  `${siteUrl}/onboarding/complete?companyId=${companyId}`,
      type:        'account_onboarding',
    })

    return new Response(JSON.stringify({ url: accountLink.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(String(err))
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
