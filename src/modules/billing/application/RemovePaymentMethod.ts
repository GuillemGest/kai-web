import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'

/**
 * Elimina una tarjeta guardada. El repositorio verifica la titularidad
 * (organización ↔ tarjeta) y bloquea el borrado si es la predeterminada y hay
 * suscripciones activas que dependen de ella para cobrar.
 */
export class RemovePaymentMethod {
  constructor(private readonly repository: IPaymentMethodRepository) {}

  execute(organizationId: string, paymentMethodId: string): Promise<void> {
    return this.repository.remove(organizationId, paymentMethodId)
  }
}
