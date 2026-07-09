import { AuthSession, type AuthSessionPrimitive } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'
import { InvalidCodeError } from '../domain/InvalidCodeError'
import { InvalidCredentialsError } from '../domain/InvalidCredentialsError'
import { User } from '../domain/User'

/**
 * Base del servicio de autenticación.
 *
 * En el navegador usamos la ruta relativa `/auth-api`, servida por el proxy de
 * desarrollo de Vite (ver `astro.config.mjs`), para evitar el preflight CORS
 * contra el dominio del backend. Fuera del navegador (SSR, scripts) llamamos al
 * dominio absoluto, donde CORS no aplica.
 */
const API_BASE =
  typeof window !== 'undefined'
    ? '/auth-api'
    : 'https://authentication.amplifysoft.io/api'

/** Clave de la sesión persistida en el navegador. */
const SESSION_KEY = 'kai.auth.session'

/**
 * Respuesta del primer paso. El backend responde `200 OK` incluso cuando las
 * credenciales son inválidas, indicando el fallo con `success: false`; por eso
 * hay que mirar el body, no solo el status HTTP.
 */
interface LoginResponse {
  success: boolean
  message?: string
}

/**
 * Forma esperada de la respuesta al validar el código (segundo paso).
 *
 * Es una suposición razonable hasta confirmar la respuesta real del backend;
 * si difiere, solo hay que ajustar {@link HttpAuthRepository.toSession}.
 */
interface ValidateResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    createdAt: string
  }
}

/**
 * Repositorio de auth contra el backend real (Amplify), con login en dos pasos:
 *
 *  1. `login(email, password)` → `POST /login/{email}` con `{ password }`.
 *     Valida credenciales y dispara el envío del código; no devuelve sesión.
 *  2. `validateCode(email, code)` → `POST /login/{email}/validate/{code}`.
 *     Valida el código y devuelve la sesión, que se persiste en `localStorage`.
 *
 * Implementa {@link IAuthRepository}, por lo que use cases y UI no cambian.
 */
export class HttpAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<void> {
    const res = await fetch(`${API_BASE}/login/${email}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    // Un status HTTP de error (5xx, etc.) es un fallo de infraestructura.
    if (!res.ok) {
      throw new Error(`Login failed (${res.status})`)
    }

    // El backend responde 200 aun con credenciales inválidas: el resultado real
    // está en `success`. Si es false, son credenciales incorrectas.
    const data = (await res.json()) as LoginResponse
    if (!data.success) {
      throw new InvalidCredentialsError()
    }
  }

  async validateCode(email: string, code: string): Promise<AuthSession> {
    const res = await fetch(`${API_BASE}/login/${email}/validate/${code}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new InvalidCodeError()
      }
      throw new Error(`Code validation failed (${res.status})`)
    }

    const data = (await res.json()) as ValidateResponse
    const session = this.toSession(data)
    this.persist(session)
    return session
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

  /**
   * Mapea la respuesta del backend a nuestro dominio. Único punto a tocar si la
   * forma real de la respuesta difiere de {@link ValidateResponse}.
   */
  private toSession(data: ValidateResponse): AuthSession {
    return AuthSession.fromPrimitive({ user: data.user, token: data.token })
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
      // Sesión corrupta: la descartamos para no dejar un estado inválido.
      localStorage.removeItem(SESSION_KEY)
      return null
    }
  }
}
