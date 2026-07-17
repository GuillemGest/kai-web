import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'
import type { PaymentMethod } from '../domain/PaymentMethod'

export class GetPaymentMethods {
  constructor(private readonly repository: IPaymentMethodRepository) {}

  execute(organizationId: string): Promise<PaymentMethod[]> {
    return this.repository.listByOrganization(organizationId)
  }
}
