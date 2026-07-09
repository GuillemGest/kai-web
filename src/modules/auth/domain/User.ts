export interface UserPrimitive {
  id: string
  email: string
  name: string
  createdAt: string
}

export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly createdAt: string,
  ) {}

  static fromPrimitive(data: UserPrimitive): User {
    return new User(data.id, data.email, data.name, data.createdAt)
  }

  /**
   * Construye un User leyendo los claims del payload del JWT emitido por el
   * backend Amplify. La respuesta de `/login/{email}/validate/{code}` solo
   * devuelve el token, así que la información del usuario vive dentro del JWT.
   */
  static fromJwt(token: string): User {
    const claims = decodeJwtPayload(token)
    const email = String(claims.email ?? '')
    const id = String(claims.sub ?? claims.userId ?? claims.id ?? email)
    const name = String(
      claims.name ?? claims.given_name ?? (email ? email.split('@')[0] : ''),
    )
    const createdAt =
      typeof claims.iat === 'number'
        ? new Date(claims.iat * 1000).toISOString()
        : new Date().toISOString()
    return new User(id, email, name, createdAt)
  }

  toPrimitive(): UserPrimitive {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
    }
  }
}

function decodeJwtPayload(token: string): Record<string, unknown> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token payload')
  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
    const json = atob(padded)
    return JSON.parse(json) as Record<string, unknown>
  } catch {
    throw new Error('Invalid token payload')
  }
}
