import type { Company } from '../../domain/entities/Company'

export interface ICompanyRepository {
  getById(id: string): Promise<Company | undefined>
  getByStripeAccountId(stripeAccountId: string): Promise<Company | undefined>
  create(data: { name: string }): Promise<Company>
  updateStripeAccountId(id: string, stripeAccountId: string): Promise<void>
  updateOnboardingComplete(id: string, complete: boolean): Promise<void>
}
