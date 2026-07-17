/**
 * Puerto de salida para guardar una tarjeta nueva sin cobrar nada (Setup
 * Intent). Separado de `ICheckoutGateway` a propósito: comprar una suscripción
 * y guardar una tarjeta son operaciones distintas (esta no lleva líneas de
 * precio, plan ni datos fiscales — el Customer ya existe). La implementación
 * concreta vive en `infrastructure/`.
 */
export interface ICardSetupGateway {
  /**
   * Crea una sesión alojada donde el usuario introduce una tarjeta nueva y
   * Stripe la guarda en el Customer de la organización indicada (sin cobrar).
   * Devuelve la URL a la que redirigir.
   */
  createSetupSession(
    organizationId: string,
    successUrl: string,
    cancelUrl: string,
  ): Promise<{ url: string }>
}
