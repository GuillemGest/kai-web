import type { IPaymentMethodRepository } from '../domain/IPaymentMethodRepository'

/**
 * Elimina una tarjeta guardada. El repositorio verifica la titularidad
 * (email ↔ tarjeta) y bloquea el borrado si es la predeterminada y hay
 * suscripciones activas que dependen de ella para cobrar.
 */
export class RemovePaymentMethod {
  constructor(private readonly repository: IPaymentMethodRepository) {}

  execute(email: string, paymentMethodId: string): Promise<void> {
    return this.repository.remove(email, paymentMethodId)
  }
}
