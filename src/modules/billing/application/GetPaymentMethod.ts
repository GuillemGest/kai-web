import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'
import type { PaymentMethod } from '../domain/PaymentMethod'

export class GetPaymentMethod {
  constructor(private readonly repository: IPaymentMethodRepository) {}

  execute(userId: string): Promise<PaymentMethod | null> {
    return this.repository.getDefault(userId)
  }
}
