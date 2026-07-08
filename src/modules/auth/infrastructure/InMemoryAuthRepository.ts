import { AuthSession } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'
import { User, type UserPrimitive } from '../domain/User'

const MOCK_USER: UserPrimitive = {
  id: 'user-1',
  email: 'demo@kai.app',
  name: 'Usuario Demo',
  createdAt: '2026-01-15T10:00:00.000Z',
}

/**
 * Repositorio de auth de prototipo: simula sesión en memoria.
 * No autentica de verdad; cualquier credencial inicia sesión como el usuario mock.
 * Se sustituirá por SupabaseAuthRepository sin tocar use cases ni UI.
 */
export class InMemoryAuthRepository implements IAuthRepository {
  private session: AuthSession | null = null

  async login(_email: string, _password: string): Promise<AuthSession> {
    this.session = AuthSession.fromPrimitive({ user: MOCK_USER, token: 'mock-token' })
    return this.session
  }

  async logout(): Promise<void> {
    this.session = null
  }

  async getCurrentUser(): Promise<User | null> {
    return this.session ? this.session.user : User.fromPrimitive(MOCK_USER)
  }
}
