export interface OrganizationPrimitive {
  id: string
  name: string
  /**
   * Enlace 1:1 organización↔Customer de Stripe. `null` hasta que la
   * organización paga algo por primera vez (checkout o alta de tarjeta).
   * Fuente de verdad: backend Amplify.
   */
  stripeCustomerId: string | null
}

export class Organization {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly stripeCustomerId: string | null,
  ) {}

  static fromPrimitive(data: OrganizationPrimitive): Organization {
    return new Organization(data.id, data.name, data.stripeCustomerId)
  }

  toPrimitive(): OrganizationPrimitive {
    return { id: this.id, name: this.name, stripeCustomerId: this.stripeCustomerId }
  }
}
