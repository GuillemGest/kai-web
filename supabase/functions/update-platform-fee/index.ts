// Sets the commission charged to a company (organizations.platform_fee_percentage).
// Restricted to staff with admin_minor/admin_superior role inside the platform's
// own organization (type='admin') — a normal company cannot set its own
// commission. Runs with the service-role key; authorization is checked here
// against the caller's JWT, since this is a money-affecting setting.

import { canManageMemberships, getUserIdFromJwt } from '../_shared/auth.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = () => Deno.env.get('SUPABASE_URL')!
const SUPABASE_KEY = () => Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

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

async function isPlatformFeeManager(userId: string): Promise<boolean> {
  const rows = await supabaseGet(
    'user_organizations',
    `user_id=eq.${userId}&select=role,organizations(type)`,
  )
  if (!Array.isArray(rows)) return false
  return rows.some((r) => {
    if (!canManageMemberships(r.role)) return false
    const org = Array.isArray(r.organizations) ? r.organizations[0] : r.organizations
    return org?.type === 'admin'
  })
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const userId = getUserIdFromJwt(req.headers.get('authorization'))
    if (!userId || !(await isPlatformFeeManager(userId))) {
      return new Response(JSON.stringify({ error: 'No autorizado' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { companyId, feePercentage } = await req.json()
    if (!companyId) {
      return new Response(JSON.stringify({ error: 'Falta companyId' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    if (feePercentage !== null && (typeof feePercentage !== 'number' || feePercentage < 0 || feePercentage > 1)) {
      return new Response(JSON.stringify({ error: 'La comisión debe estar entre 0 y 1 (o null)' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    await supabasePatch('organizations', `id=eq.${companyId}`, { platform_fee_percentage: feePercentage })

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
