import { AuthSession, type CachedSessionPrimitive } from '../domain/AuthSession'
import type {
  IAuthRepository,
  LoginResult,
  SwitchAccountResult,
} from '../domain/IAuthRepository'
import { InvalidCodeError } from '../domain/InvalidCodeError'
import { InvalidCredentialsError } from '../domain/InvalidCredentialsError'
import { Organization } from '../domain/Organization'
import { User, type UserPrimitive } from '../domain/User'
import accounts from './accounts.mock.json'

/** Forma de una cuenta en el JSON mock: usuario + contraseña en claro (solo prototipo). */
interface MockAccount extends UserPrimitive {
  password: string
}

const MOCK_ACCOUNTS = accounts as MockAccount[]

/** Clave compartida con el HttpAuthRepository real (shared shape con frontend-kai). */
const SESSION_KEY = 'cached_session'

/** Código de verificación fijo del mock (solo prototipo/tests). */
const MOCK_CODE = '123456'

/**
 * Repositorio de auth de prototipo. Alineado con el mismo contrato que el
 * `HttpAuthRepository`: `login` devuelve un `LoginResult` discriminado.
 */
export class InMemoryAuthRepository implements IAuthRepository {
  /** Email cuyas credenciales pasaron el paso 1 y esperan validar el código. */
  private pendingEmail: string | null = null
  /** Password del último login válido, para reenviar en validateCode como hace el backend real. */
  private pendingPassword: string | null = null

  async login(
    email: string,
    password: string,
    _organization?: Organization,
  ): Promise<LoginResult> {
    const account = this.findAccount(email)

    if (!account || account.password !== password) {
      throw new InvalidCredentialsError()
    }

    this.pendingEmail = account.email.toLowerCase()
    this.pendingPassword = password
    return { kind: 'code_required' }
  }

  async validateCode(
    email: string,
    code: string,
    password: string,
    organization?: Organization,
  ): Promise<AuthSession> {
    const account = this.findAccount(email)
    const normalizedEmail = email.trim().toLowerCase()

    if (
      !account ||
      this.pendingEmail !== normalizedEmail ||
      this.pendingPassword !== password ||
      code !== MOCK_CODE
    ) {
      throw new InvalidCodeError()
    }

    const { password: _password, ...userPrimitive } = account
    const session = new AuthSession(
      User.fromPrimitive(userPrimitive),
      `mock-token-${account.id}`,
      organization,
    )
    this.pendingEmail = null
    this.pendingPassword = null
    this.persist(session)
    return session
  }

  async setSsoCookie(_token: string): Promise<void> {
    // No-op en mock.
  }

  async verifySession(): Promise<AuthSession | null> {
    // Mock: la sesión persistida siempre se considera válida.
    return this.readSession()
  }

  private findAccount(email: string): MockAccount | undefined {
    const normalizedEmail = email.trim().toLowerCase()
    return MOCK_ACCOUNTS.find((a) => a.email.toLowerCase() === normalizedEmail)
  }

  async logout(): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  async getCurrentUser(): Promise<User | null> {
    return this.getCurrentUserSync()
  }

  getCurrentUserSync(): User | null {
    const session = this.readSession()
    return session ? session.user : null
  }

  getCurrentSessionSync(): AuthSession | null {
    return this.readSession()
  }

  getSavedAccounts(): CachedSessionPrimitive[] {
    // Mock: el prototipo no mantiene roster; expone la activa si existe para
    // que el header pueda pintar el desplegable en tests sin flakear.
    const session = this.readSession()
    return session ? [session.toStoragePrimitive()] : []
  }

  async switchToSavedAccount(entry: CachedSessionPrimitive): Promise<SwitchAccountResult> {
    const session = AuthSession.fromStoragePrimitive(entry)
    this.persist(session)
    return { ok: true, session }
  }

  removeSavedAccount(_email: string, _organizationId?: string): void {
    // No-op: sin roster real en el mock.
  }

  private persist(session: AuthSession): void {
    if (typeof localStorage === 'undefined') return
    // Mock: guardamos el shape completo (con user) para no depender de decodificar JWT.
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        ...session.toStoragePrimitive(),
        __mockUser: session.user.toPrimitive(),
      }),
    )
  }

  private readSession(): AuthSession | null {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      const parsed = JSON.parse(raw) as CachedSessionPrimitive & {
        __mockUser?: UserPrimitive
      }
      if (parsed.__mockUser) {
        const org =
          parsed.organizationId && parsed.organizationName
            ? new Organization(parsed.organizationId, parsed.organizationName, null)
            : undefined
        return new AuthSession(
          User.fromPrimitive(parsed.__mockUser),
          parsed.token,
          org,
          parsed.organizationDatabaseId,
        )
      }
      return AuthSession.fromStoragePrimitive(parsed)
    } catch {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
  }
}
