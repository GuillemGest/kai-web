import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'
import type { PaymentMethod } from '../domain/PaymentMethod'

export class GetPaymentMethods {
  constructor(private readonly repository: IPaymentMethodRepository) {}

  execute(email: string): Promise<PaymentMethod[]> {
    return this.repository.listByEmail(email)
  }
}
