import type { ICardSetupGateway } from '../domain/ICardSetupGateway'

export interface CreateCardSetupSessionInput {
  organizationId: string
  successUrl: string
  cancelUrl: string
}

/**
 * Crea una sesión alojada de Stripe para guardar una tarjeta nueva en la
 * cuenta, sin cobrar nada. La tarjeta queda disponible para marcarla como
 * predeterminada (`SetDefaultPaymentMethod`) una vez guardada.
 */
export class CreateCardSetupSession {
  constructor(private readonly cardSetupGateway: ICardSetupGateway) {}

  execute(input: CreateCardSetupSessionInput): Promise<{ url: string }> {
    return this.cardSetupGateway.createSetupSession(
      input.organizationId,
      input.successUrl,
      input.cancelUrl,
    )
  }
}
