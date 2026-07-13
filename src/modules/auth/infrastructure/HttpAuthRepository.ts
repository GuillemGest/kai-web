import { AuthSession, type CachedSessionPrimitive } from '../domain/AuthSession'
import type { IAuthRepository, LoginResult } from '../domain/IAuthRepository'
import { InvalidCodeError } from '../domain/InvalidCodeError'
import { InvalidCredentialsError } from '../domain/InvalidCredentialsError'
import { Organization, type OrganizationPrimitive } from '../domain/Organization'
import { User } from '../domain/User'

/**
 * URL absoluta del backend Amplify.
 */
const AUTH_API_URL = 'https://authentication.amplifysoft.io/api'

/**
 * Base del servicio de autenticación.
 *
 * - **SSR / scripts**: URL absoluta (no hay CORS).
 * - **Browser en dev**: ruta relativa `/auth-api`, servida por el proxy de Vite
 *   (ver `astro.config.mjs`), para evitar el preflight CORS contra el dominio
 *   del backend en local.
 * - **Browser en prod**: URL absoluta directa. Necesario para que el
 *   `Set-Cookie` de `/login/set/cookie` (Domain=.amplifysoft.io) sea aceptado
 *   por el navegador — si pasa por un proxy same-origin, el browser lo scope
 *   al origen del proxy y descarta el cookie.
 */
const API_BASE =
  typeof window === 'undefined'
    ? AUTH_API_URL
    : import.meta.env.DEV
      ? '/auth-api'
      : AUTH_API_URL

/**
 * Clave en `localStorage` compartida con frontend-kai para permitir handoff
 * SSO cuando ambas apps sirven en el mismo origin. Guarda el shape completo
 * (email, org, timestamp) útil para otras apps del ecosistema.
 */
const SESSION_KEY = 'cached_session'

/**
 * Cookie del origin de kai-web que guarda SOLO el token. El resto de la
 * sesión (email, name, org) se re-deriva del payload del JWT y de
 * `localStorage`, evitando duplicar datos y mantener la cookie por debajo del
 * límite de 4KB.
 */
const TOKEN_COOKIE_KEY = 'kai_auth_token'

/** Días de vida de la cookie de token en el origin de kai-web. */
const TOKEN_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30 // 30 días

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

interface SessionCurrentResponse {
  success: boolean
  message?: string
  payload?: unknown
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
 *  4. `GET /login/session/current` con `Authorization: Bearer <JWT>` para
 *     confirmar que la sesión sigue viva tras un reload (F5).
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

  /**
   * Confirma con el backend que el token guardado sigue siendo válido.
   *
   * Pensada para el primer render tras un F5: si la sesión persistida existe
   * pero el backend la rechaza (token expirado, revocado, etc.), la limpiamos y
   * devolvemos `null` para que la UI vuelva a estado no-autenticado.
   */
  async verifySession(): Promise<AuthSession | null> {
    const session = this.readSession()
    if (!session) return null

    try {
      const res = await fetch(`${API_BASE}/login/session/current`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${session.token}` },
        credentials: 'include',
      })

      if (!res.ok) {
        await this.logout()
        return null
      }

      const data = (await res.json()) as SessionCurrentResponse
      if (!data.success) {
        await this.logout()
        return null
      }

      // Si el backend refresca el token, lo aceptamos.
      if (data.message && isJwt(data.message) && data.message !== session.token) {
        const refreshed = this.buildSession(
          data.message,
          session.organization?.id,
        )
        this.persist(refreshed)
        return refreshed
      }

      return session
    } catch (err) {
      // Fallo de red: no borramos la sesión, dejamos que el usuario reintente.
      console.warn('verifySession failed', err)
      return session
    }
  }

  async logout(): Promise<void> {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(SESSION_KEY)
    }
    deleteCookie(TOKEN_COOKIE_KEY)
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
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session.toStoragePrimitive()))
    }
    setCookie(TOKEN_COOKIE_KEY, session.token, TOKEN_COOKIE_MAX_AGE_SECONDS)
  }

  /**
   * Cookie autoritativa: sin cookie no hay sesión, aunque `localStorage`
   * conserve datos. Evita el caso "el usuario borra cookies pero sigue
   * logueado" y garantiza que el estado de sesión coincida con lo que el
   * backend puede validar en `verifySession`.
   *
   * Con cookie válida priorizamos el shape rico de `localStorage` (email,
   * org, timestamp) para no perder el contexto de organización; si el
   * localStorage falta o es incoherente con el token, reconstruimos la
   * sesión decodificando el JWT.
   */
  private readSession(): AuthSession | null {
    const token = readCookie(TOKEN_COOKIE_KEY)
    if (!token) {
      // Sin cookie de token: limpiamos cualquier residuo en localStorage para
      // que ambas fuentes de verdad sigan alineadas.
      if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_KEY)
      return null
    }

    const raw = readLocalStorage(SESSION_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as CachedSessionPrimitive
        // Si el localStorage guarda un token distinto al de la cookie, la
        // cookie manda: descartamos el shape rico y volvemos al JWT.
        if (parsed.token === token) {
          return AuthSession.fromStoragePrimitive(parsed)
        }
        if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_KEY)
      } catch {
        if (typeof localStorage !== 'undefined') localStorage.removeItem(SESSION_KEY)
      }
    }

    try {
      return new AuthSession(User.fromJwt(token), token)
    } catch {
      deleteCookie(TOKEN_COOKIE_KEY)
      return null
    }
  }
}

function isJwt(value: string): boolean {
  return typeof value === 'string' && value.split('.').length === 3
}

function readLocalStorage(key: string): string | null {
  if (typeof localStorage === 'undefined') return null
  return localStorage.getItem(key)
}

/**
 * Cookies en cliente para el origin de kai-web. El backend Amplify emite su
 * propia cookie HttpOnly (ver `setSsoCookie`) que kai-web no puede leer; esta
 * cookie es el gemelo accesible en JS para sobrevivir al F5 y confirmar sesión.
 *
 * `SameSite=Lax` permite navegación normal; en dev sobre http el flag `Secure`
 * queda desactivado para poder escribir la cookie sin https.
 */
function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === 'undefined') return
  const isHttps = typeof location !== 'undefined' && location.protocol === 'https:'
  const attrs = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${maxAgeSeconds}`,
    'SameSite=Lax',
    ...(isHttps ? ['Secure'] : []),
  ]
  document.cookie = attrs.join('; ')
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const prefix = `${name}=`
  const parts = document.cookie ? document.cookie.split('; ') : []
  for (const part of parts) {
    if (part.startsWith(prefix)) {
      try {
        return decodeURIComponent(part.slice(prefix.length))
      } catch {
        return null
      }
    }
  }
  return null
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`
}
