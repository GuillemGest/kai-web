import { supabase } from '../supabase/client'
import type { ICompanyRepository } from '../../application/ports/ICompanyRepository'
import type { Company } from '../../domain/entities/Company'

// A company is backed by the organizations table; the Stripe columns live there.
export type DbCompany = {
  id: string
  name: string
  stripe_account_id: string | null
  stripe_onboarding_complete: boolean | null
  platform_fee_percentage: number | null
}

export const COMPANY_COLUMNS = 'id, name, stripe_account_id, stripe_onboarding_complete, platform_fee_percentage'

export function mapCompany(row: DbCompany): Company {
  return {
    id:                       row.id,
    name:                     row.name,
    stripeAccountId:          row.stripe_account_id ?? undefined,
    stripeOnboardingComplete: row.stripe_onboarding_complete ?? false,
    platformFeePercentage:    row.platform_fee_percentage ?? undefined,
  }
}

export class SupabaseCompanyRepository implements ICompanyRepository {
  async getById(id: string): Promise<Company | undefined> {
    const { data, error } = await supabase
      .from('organizations')
      .select(COMPANY_COLUMNS)
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data ? mapCompany(data as DbCompany) : undefined
  }

  async getByStripeAccountId(stripeAccountId: string): Promise<Company | undefined> {
    const { data, error } = await supabase
      .from('organizations')
      .select(COMPANY_COLUMNS)
      .eq('stripe_account_id', stripeAccountId)
      .maybeSingle()
    if (error) throw error
    return data ? mapCompany(data as DbCompany) : undefined
  }

  async create(data: { name: string }): Promise<Company> {
    const { data: row, error } = await supabase
      .from('organizations')
      .insert({ name: data.name, type: 'normal' })
      .select(COMPANY_COLUMNS)
      .single()
    if (error) throw error
    return mapCompany(row as DbCompany)
  }

  async updateStripeAccountId(id: string, stripeAccountId: string): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .update({ stripe_account_id: stripeAccountId })
      .eq('id', id)
    if (error) throw error
  }

  async updateOnboardingComplete(id: string, complete: boolean): Promise<void> {
    const { error } = await supabase
      .from('organizations')
      .update({ stripe_onboarding_complete: complete })
      .eq('id', id)
    if (error) throw error
  }
}
