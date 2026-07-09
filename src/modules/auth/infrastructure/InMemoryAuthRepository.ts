import { AuthSession, type AuthSessionPrimitive } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'
import { InvalidCodeError } from '../domain/InvalidCodeError'
import { InvalidCredentialsError } from '../domain/InvalidCredentialsError'
import { User, type UserPrimitive } from '../domain/User'
import accounts from './accounts.mock.json'

/** Forma de una cuenta en el JSON mock: usuario + contraseña en claro (solo prototipo). */
interface MockAccount extends UserPrimitive {
  password: string
}

const MOCK_ACCOUNTS = accounts as MockAccount[]

/** Clave de la sesión persistida en el navegador. */
const SESSION_KEY = 'kai.auth.session'

/** Código de verificación fijo del mock (solo prototipo/tests). */
const MOCK_CODE = '123456'

/**
 * Repositorio de auth de prototipo.
 *
 * Valida las credenciales contra un JSON de cuentas mockeadas
 * (`accounts.mock.json`) y persiste la sesión en `localStorage`, de modo que
 * sobreviva a recargas y navegación entre páginas. Se sustituirá por
 * SupabaseAuthRepository sin tocar use cases ni UI.
 */
export class InMemoryAuthRepository implements IAuthRepository {
  /** Email cuyas credenciales ya pasaron el paso 1 y esperan validar el código. */
  private pendingEmail: string | null = null

  async login(email: string, password: string): Promise<void> {
    const account = this.findAccount(email)

    // Mismo error para "email no existe" y "contraseña incorrecta": no filtramos
    // qué cuentas están registradas.
    if (!account || account.password !== password) {
      throw new InvalidCredentialsError()
    }

    // Primer paso superado: simulamos el envío del código y dejamos el email
    // pendiente de validación.
    this.pendingEmail = account.email.toLowerCase()
  }

  async validateCode(email: string, code: string): Promise<AuthSession> {
    const account = this.findAccount(email)
    const normalizedEmail = email.trim().toLowerCase()

    if (!account || this.pendingEmail !== normalizedEmail || code !== MOCK_CODE) {
      throw new InvalidCodeError()
    }

    const { password: _password, ...userPrimitive } = account
    const session = AuthSession.fromPrimitive({
      user: userPrimitive,
      token: `mock-token-${account.id}`,
    })
    this.pendingEmail = null
    this.persist(session)
    return session
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

  private persist(session: AuthSession): void {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(SESSION_KEY, JSON.stringify(session.toPrimitive()))
  }

  private readSession(): AuthSession | null {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      return AuthSession.fromPrimitive(JSON.parse(raw) as AuthSessionPrimitive)
    } catch {
      // Sesión corrupta: la descartamos para no dejar al usuario en un estado inválido.
      localStorage.removeItem(SESSION_KEY)
      return null
    }
  }
}
