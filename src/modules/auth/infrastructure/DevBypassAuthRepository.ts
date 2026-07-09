import { AuthSession } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'
import { User } from '../domain/User'

/**
 * ⚠️ PROVISIONAL / SOLO DESARROLLO — QUITAR ANTES DE PRODUCCIÓN.
 *
 * Decorator de {@link IAuthRepository} que añade un "entrar mock": crea una
 * sesión de desarrollo al instante, sin credenciales ni código 2FA, para probar
 * el flujo (p. ej. el checkout de Stripe) sin depender del backend real.
 *
 * Todo el comportamiento normal de auth se delega tal cual en el repo real; solo
 * añade el método extra {@link loginMock}. La UI lo invoca desde un botón de
 * desarrollo en el login.
 *
 * Para desactivarlo: dejar de envolver en `auth/application/factory.ts` y borrar
 * el botón mock del login.
 */
const SESSION_KEY = 'kai.auth.session'

const MOCK_USER: User = User.fromPrimitive({
  id: 'dev-kai',
  // Email con TLD válido: Stripe rechaza direcciones sin dominio completo.
  email: 'kai@kai.dev',
  name: 'KAI Dev',
  createdAt: new Date('2026-01-01').toISOString(),
})

export class DevBypassAuthRepository implements IAuthRepository {
  constructor(private readonly real: IAuthRepository) {}

  /**
   * Crea y persiste una sesión de desarrollo saltándose todos los pasos.
   * Devuelve la sesión para que la UI pueda continuar el flujo (checkout, etc.).
   */
  async loginMock(): Promise<AuthSession> {
    const session = new AuthSession(MOCK_USER, 'dev-mock-token')
    this.persist(session)
    return session
  }

  login(email: string, password: string): Promise<void> {
    return this.real.login(email, password)
  }

  validateCode(email: string, code: string): Promise<AuthSession> {
    return this.real.validateCode(email, code)
  }

  logout(): Promise<void> {
    return this.real.logout()
  }

  getCurrentUser(): Promise<User | null> {
    return this.real.getCurrentUser()
  }

  getCurrentUserSync(): User | null {
    return this.real.getCurrentUserSync()
  }

  private persist(session: AuthSession): void {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(SESSION_KEY, JSON.stringify(session.toPrimitive()))
  }
}
