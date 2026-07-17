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

  /**
   * Intenta reconstruir la organización desde los claims del JWT emitido por
   * el backend Amplify. Útil cuando el usuario tiene una sola organización y
   * el backend no dispara la rama `SELECT_ORGANIZATION`: el id/nombre llegan
   * dentro del payload del token en vez de por el ciclo de picker.
   *
   * Es tolerante con varios shapes de claims (plano, prefijo `custom:`,
   * anidado) porque el backend puede evolucionar la forma sin previo aviso.
   * Si no encuentra información fiable, devuelve `undefined`.
   */
  static fromJwt(token: string): Organization | undefined {
    let claims: Record<string, unknown>
    try {
      claims = decodeJwtPayload(token)
    } catch {
      return undefined
    }

    const nested =
      isObject(claims.organization) ? (claims.organization as Record<string, unknown>) : null

    const id = firstString(
      nested?.id,
      nested?.organizationId,
      claims.organizationId,
      claims['custom:organizationId'],
      typeof claims.organization === 'string' ? claims.organization : undefined,
      claims['custom:organization'],
      claims.tenantId,
      claims['custom:tenant'],
    )

    if (!id) return undefined

    const name =
      firstString(
        nested?.name,
        nested?.organizationName,
        claims.organizationName,
        claims['custom:organizationName'],
        claims.tenantName,
      ) ?? id

    return new Organization(id, name, null)
  }

  toPrimitive(): OrganizationPrimitive {
    return { id: this.id, name: this.name, stripeCustomerId: this.stripeCustomerId }
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token payload')
  const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return JSON.parse(atob(padded)) as Record<string, unknown>
}

function isObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function firstString(...candidates: unknown[]): string | undefined {
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) return c
  }
  return undefined
}
