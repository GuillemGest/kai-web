import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'

/**
 * Marca una tarjeta guardada como la predeterminada: la que Stripe usará para
 * cobrar la próxima renovación de cualquier suscripción del Customer. La
 * titularidad (organización ↔ tarjeta) la verifica el repositorio.
 */
export class SetDefaultPaymentMethod {
  constructor(private readonly repository: IPaymentMethodRepository) {}

  execute(organizationId: string, paymentMethodId: string): Promise<void> {
    return this.repository.setDefault(organizationId, paymentMethodId)
  }
}
