import { AuthSession, type CachedSessionPrimitive } from '../domain/AuthSession'
import type { IAuthRepository, LoginResult } from '../domain/IAuthRepository'
import { InvalidCodeError } from '../domain/InvalidCodeError'
import { InvalidCredentialsError } from '../domain/InvalidCredentialsError'
import { Organization, type OrganizationPrimitive } from '../domain/Organization'
import { User } from '../domain/User'

/**
 * Base del servicio de autenticación.
 *
 * En el navegador usamos la ruta relativa `/auth-api`, servida por el proxy de
 * desarrollo de Vite (ver `astro.config.mjs`), para evitar el preflight CORS
 * contra el dominio del backend. Fuera del navegador llamamos al dominio
 * absoluto, donde CORS no aplica.
 */
const API_BASE =
  typeof window !== 'undefined'
    ? '/auth-api'
    : 'https://authentication.amplifysoft.io/api'

/**
 * Clave compartida con frontend-kai para permitir handoff SSO en el ecosistema
 * Amplify cuando ambas apps sirven en el mismo origin.
 */
const SESSION_KEY = 'cached_session'

/** Marcador que el backend usa cuando exige elegir organización. */
const SELECT_ORG_MARKER = 'SELECT_ORGANIZATION'

interface LoginBackendResponse {
  success: boolean
  message?: string
  payload?: OrganizationPrimitive[] | unknown
}

interface ValidateBackendResponse {
  success: boolean
  message?: string
}

/**
 * Repositorio de auth contra el backend real (Amplify).
 *
 * Contrato:
 *  1. `POST /login/{email}` body `{ password, organization? }` →
 *     `{ success, message, payload? }`. Ramas: credenciales inválidas,
 *     SELECT_ORGANIZATION, JWT directo, o código 2FA enviado.
 *  2. `POST /login/{email}/validate/{code}` body `{ password, organization? }` →
 *     `{ success, message: <JWT> }`.
 *  3. `GET /login/set/cookie` con `Authorization: Bearer <JWT>` (best-effort SSO).
 *
 * El backend responde 200 aun cuando la operación falla; hay que mirar `success`.
 */
export class HttpAuthRepository implements IAuthRepository {
  async login(
    email: string,
    password: string,
    organization?: string,
  ): Promise<LoginResult> {
    const res = await fetch(`${API_BASE}/login/${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password, organization }),
    })

    if (!res.ok) throw new Error(`Login failed (${res.status})`)

    const data = (await res.json()) as LoginBackendResponse
    if (!data.success) throw new InvalidCredentialsError()

    const message = data.message ?? ''

    if (message === SELECT_ORG_MARKER) {
      const orgs = Array.isArray(data.payload)
        ? (data.payload as OrganizationPrimitive[]).map(Organization.fromPrimitive)
        : []
      return { kind: 'select_org', orgs }
    }

    if (isJwt(message)) {
      const session = this.buildSession(message, organization)
      this.persist(session)
      return { kind: 'session', session }
    }

    return { kind: 'code_required' }
  }

  async validateCode(
    email: string,
    code: string,
    password: string,
    organization?: string,
  ): Promise<AuthSession> {
    const res = await fetch(
      `${API_BASE}/login/${encodeURIComponent(email)}/validate/${encodeURIComponent(code)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password, organization }),
      },
    )

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) throw new InvalidCodeError()
      throw new Error(`Code validation failed (${res.status})`)
    }

    const data = (await res.json()) as ValidateBackendResponse
    if (!data.success || !data.message || !isJwt(data.message)) {
      throw new InvalidCodeError()
    }

    const session = this.buildSession(data.message, organization)
    this.persist(session)
    return session
  }

  async setSsoCookie(token: string): Promise<void> {
    try {
      await fetch(`${API_BASE}/login/set/cookie`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      })
    } catch (err) {
      // Best-effort: la ausencia de cookie SSO no impide continuar la sesión.
      console.warn('setSsoCookie failed', err)
    }
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

  private buildSession(token: string, organizationId?: string): AuthSession {
    const user = User.fromJwt(token)
    const organization = organizationId
      ? new Organization(organizationId, organizationId)
      : undefined
    return new AuthSession(user, token, organization)
  }

  private persist(session: AuthSession): void {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(SESSION_KEY, JSON.stringify(session.toStoragePrimitive()))
  }

  private readSession(): AuthSession | null {
    if (typeof localStorage === 'undefined') return null
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      return AuthSession.fromStoragePrimitive(
        JSON.parse(raw) as CachedSessionPrimitive,
      )
    } catch {
      // Sesión corrupta o token inválido: descartamos.
      localStorage.removeItem(SESSION_KEY)
      return null
    }
  }
}

function isJwt(value: string): boolean {
  return typeof value === 'string' && value.split('.').length === 3
}
