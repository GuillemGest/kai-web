import { AuthSession, type AuthSessionPrimitive } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'
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

/**
 * Repositorio de auth de prototipo.
 *
 * Valida las credenciales contra un JSON de cuentas mockeadas
 * (`accounts.mock.json`) y persiste la sesión en `localStorage`, de modo que
 * sobreviva a recargas y navegación entre páginas. Se sustituirá por
 * SupabaseAuthRepository sin tocar use cases ni UI.
 */
export class InMemoryAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<AuthSession> {
    const normalizedEmail = email.trim().toLowerCase()
    const account = MOCK_ACCOUNTS.find((a) => a.email.toLowerCase() === normalizedEmail)

    // Mismo error para "email no existe" y "contraseña incorrecta": no filtramos
    // qué cuentas están registradas.
    if (!account || account.password !== password) {
      throw new InvalidCredentialsError()
    }

    const { password: _password, ...userPrimitive } = account
    const session = AuthSession.fromPrimitive({
      user: userPrimitive,
      token: `mock-token-${account.id}`,
    })
    this.persist(session)
    return session
  }

  async logout(): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_KEY)
    }
  }

  async getCurrentUser(): Promise<User | null> {
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
