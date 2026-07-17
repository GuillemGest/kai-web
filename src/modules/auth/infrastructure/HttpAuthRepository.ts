import { AuthSession, type CachedSessionPrimitive } from '../domain/AuthSession'
import type {
  IAuthRepository,
  LoginResult,
  SwitchAccountResult,
} from '../domain/IAuthRepository'
import { InvalidCodeError } from '../domain/InvalidCodeError'
import { InvalidCredentialsError } from '../domain/InvalidCredentialsError'
import { Organization, type OrganizationPrimitive } from '../domain/Organization'
import { User } from '../domain/User'
import { AUTH_API_BASE } from '../../../config/appUrls'

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

/**
 * Roster local (no compartido con frontend-kai) con las cuentas que el usuario
 * ha usado en este origin. Permite el multi-cuenta desde el header sin
 * romper el contrato SSO de `cached_session`. Contiene N JWTs; mismo modelo
 * de amenazas XSS que hoy, blast radius × N — cap `MAX_SAVED_ACCOUNTS`.
 */
const SAVED_ACCOUNTS_KEY = 'kai_saved_accounts'
const MAX_SAVED_ACCOUNTS = 5

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
    // El backend espera el email literal en la ruta (con `@`, no `%40`).
    const res = await fetch(`${AUTH_API_BASE}/login/${email}`, {
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
      `${AUTH_API_BASE}/login/${email}/validate/${encodeURIComponent(code)}`,
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
      await fetch(`${AUTH_API_BASE}/login/set/cookie`, {
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
      const res = await fetch(`${AUTH_API_BASE}/login/session/current`, {
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

  getCurrentSessionSync(): AuthSession | null {
    return this.readSession()
  }

  private buildSession(token: string, organizationId?: string): AuthSession {
    const user = User.fromJwt(token)
    const organization = organizationId
      ? new Organization(organizationId, organizationId, null)
      : undefined
    return new AuthSession(user, token, organization)
  }

  private persist(session: AuthSession): void {
    const storagePrimitive = session.toStoragePrimitive()
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SESSION_KEY, JSON.stringify(storagePrimitive))
    }
    setCookie(TOKEN_COOKIE_KEY, session.token, TOKEN_COOKIE_MAX_AGE_SECONDS)
    this.upsertRoster(storagePrimitive)
  }

  getSavedAccounts(): CachedSessionPrimitive[] {
    return this.readRoster()
  }

  removeSavedAccount(email: string, organizationId?: string): void {
    const roster = this.readRoster()
    const filtered = roster.filter(
      (entry) => !sameRosterKey(entry, email, organizationId),
    )
    this.writeRoster(filtered)
  }

  async switchToSavedAccount(entry: CachedSessionPrimitive): Promise<SwitchAccountResult> {
    // Preflight: no tocamos la sesión activa hasta confirmar que el token
    // guardado sigue siendo válido. Así "fallo de switch → mantén la activa"
    // sale gratis sin un baile de restore.
    let res: Response
    try {
      res = await fetch(`${AUTH_API_BASE}/login/session/current`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${entry.token}` },
        credentials: 'include',
      })
    } catch (err) {
      console.warn('switchToSavedAccount preflight network error', err)
      return { ok: false, reason: 'network' }
    }

    if (res.status === 401 || res.status === 403) {
      this.removeSavedAccount(entry.email, entry.organizationId)
      return { ok: false, reason: 'expired' }
    }

    if (!res.ok) return { ok: false, reason: 'network' }

    let payload: SessionCurrentResponse
    try {
      payload = (await res.json()) as SessionCurrentResponse
    } catch {
      return { ok: false, reason: 'network' }
    }

    if (!payload.success) {
      this.removeSavedAccount(entry.email, entry.organizationId)
      return { ok: false, reason: 'expired' }
    }

    // El backend puede rotar el token en la respuesta; adóptalo para no dejar
    // uno próximo a expirar.
    const refreshed =
      typeof payload.message === 'string' && isJwt(payload.message)
        ? payload.message
        : entry.token

    // Reconstruye la sesión preservando el shape rico guardado (organizationName,
    // organizationDatabaseId). Reusamos `fromStoragePrimitive` con el token
    // final para no perder metadatos. `persist()` escribe cached_session ANTES
    // que la cookie, evitando el "token cookie ≠ localStorage" de readSession().
    const session = AuthSession.fromStoragePrimitive({
      ...entry,
      token: refreshed,
      timestamp: Date.now(),
    })
    this.persist(session)
    // Actualiza la cookie SSO del backend con el token final, best-effort.
    this.setSsoCookie(refreshed).catch(() => undefined)
    return { ok: true, session }
  }

  private readRoster(): CachedSessionPrimitive[] {
    if (typeof localStorage === 'undefined') return []
    const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY)
    if (!raw) return []
    try {
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return []
      return parsed.filter(isRosterEntry)
    } catch {
      return []
    }
  }

  private writeRoster(entries: CachedSessionPrimitive[]): void {
    if (typeof localStorage === 'undefined') return
    if (entries.length === 0) {
      localStorage.removeItem(SAVED_ACCOUNTS_KEY)
      return
    }
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(entries))
  }

  private upsertRoster(entry: CachedSessionPrimitive): void {
    const roster = this.readRoster()
    const others = roster.filter(
      (e) => !sameRosterKey(e, entry.email, entry.organizationId),
    )
    // La nueva entrada al frente (más reciente); truncamos a MAX (LRU).
    const next = [entry, ...others].slice(0, MAX_SAVED_ACCOUNTS)
    this.writeRoster(next)
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

/** Dedup en el roster: misma cuenta si coinciden email + organizationId. */
function sameRosterKey(
  entry: CachedSessionPrimitive,
  email: string,
  organizationId?: string,
): boolean {
  return entry.email === email && (entry.organizationId ?? '') === (organizationId ?? '')
}

function isRosterEntry(value: unknown): value is CachedSessionPrimitive {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    typeof v.email === 'string' &&
    typeof v.token === 'string' &&
    isJwt(v.token) &&
    typeof v.timestamp === 'number'
  )
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
