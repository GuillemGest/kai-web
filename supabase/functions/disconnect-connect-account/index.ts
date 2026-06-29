// Deletes a company's Stripe Connect account and clears stripe_account_id /
// stripe_onboarding_complete so the company can run the onboarding flow again
// from scratch. Caller must be admin_minor/admin_superior of that company or of
// the platform's own 'admin' org. Runs with the service-role key.

import { canManageMemberships, getUserIdFromJwt } from '../_shared/auth.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STRIPE_KEY = () => Deno.env.get('STRIPE_SECRET_KEY')!
const SUPABASE_URL = () => Deno.env.get('SUPABASE_URL')!
const SUPABASE_KEY = () => Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Caller is authorised if they hold a membership-manage role in the target
// company itself OR in the platform's own 'admin' org (super-admin path).
async function canManageCompany(userId: string, companyId: string): Promise<boolean> {
  const rows = await supabaseGet(
    'user_organizations',
    `user_id=eq.${userId}&select=organization_id,role,organizations(type)`,
  )
  if (!Array.isArray(rows)) return false
  return rows.some((r) => {
    if (!canManageMemberships(r.role)) return false
    if (r.organization_id === companyId) return true
    const org = Array.isArray(r.organizations) ? r.organizations[0] : r.organizations
    return org?.type === 'admin'
  })
}

async function stripeDeleteAccount(accountId: string): Promise<void> {
  const res = await fetch(`https://api.stripe.com/v1/accounts/${accountId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${STRIPE_KEY()}` },
  })
  if (res.ok) return
  const json = await res.json()
  // Already gone on Stripe's side: treat as success so the DB can still be cleared.
  if (json?.error?.code === 'resource_missing') return
  throw new Error(json?.error?.message ?? 'Stripe error')
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

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const userId = getUserIdFromJwt(req.headers.get('authorization'))
    const { companyId } = await req.json()
    if (!companyId) {
      return new Response(JSON.stringify({ error: 'Falta companyId' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (!userId || !(await canManageCompany(userId, companyId))) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const orgs = await supabaseGet('organizations', `id=eq.${companyId}&select=id,stripe_account_id&limit=1`)
    const org = orgs?.[0]
    if (!org) {
      return new Response(JSON.stringify({ error: 'Empresa no encontrada' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (org.stripe_account_id) {
      await stripeDeleteAccount(org.stripe_account_id)
    }

    await supabasePatch('organizations', `id=eq.${companyId}`, {
      stripe_account_id: null,
      stripe_onboarding_complete: false,
    })

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error(String(err))
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
