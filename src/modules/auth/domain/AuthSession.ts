import { Organization, type OrganizationPrimitive } from './Organization'
import { User, type UserPrimitive } from './User'

export interface AuthSessionPrimitive {
  user: UserPrimitive
  token: string
  organization?: OrganizationPrimitive
  organizationDatabaseId?: string
}

/**
 * Shape en localStorage compartido con frontend-kai (`cached_session`), para
 * habilitar handoff SSO entre las apps del ecosistema Amplify.
 */
export interface CachedSessionPrimitive {
  email: string
  token: string
  organizationId?: string
  organizationName?: string
  organizationDatabaseId?: string
  timestamp: number
}

export class AuthSession {
  constructor(
    readonly user: User,
    readonly token: string,
    readonly organization?: Organization,
    readonly organizationDatabaseId?: string,
  ) {}

  static fromPrimitive(data: AuthSessionPrimitive): AuthSession {
    return new AuthSession(
      User.fromPrimitive(data.user),
      data.token,
      data.organization ? Organization.fromPrimitive(data.organization) : undefined,
      data.organizationDatabaseId,
    )
  }

  toPrimitive(): AuthSessionPrimitive {
    return {
      user: this.user.toPrimitive(),
      token: this.token,
      organization: this.organization?.toPrimitive(),
      organizationDatabaseId: this.organizationDatabaseId,
    }
  }

  toStoragePrimitive(): CachedSessionPrimitive {
    return {
      email: this.user.email,
      token: this.token,
      organizationId: this.organization?.id,
      organizationName: this.organization?.name,
      organizationDatabaseId: this.organizationDatabaseId,
      timestamp: Date.now(),
    }
  }

  /**
   * Reconstruye la sesión desde el shape de `cached_session`. La info de user
   * se re-deriva del JWT (el shared shape no la guarda expandida).
   */
  static fromStoragePrimitive(data: CachedSessionPrimitive): AuthSession {
    const user = User.fromJwt(data.token)
    const organization =
      data.organizationId && data.organizationName
        ? new Organization(data.organizationId, data.organizationName, null)
        : undefined
    return new AuthSession(user, data.token, organization, data.organizationDatabaseId)
  }
}
