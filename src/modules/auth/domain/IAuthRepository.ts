import type { AuthSession } from './AuthSession'
import type { Organization } from './Organization'
import type { User } from './User'

/**
 * Resultado del primer paso del login. El backend Amplify puede responder de
 * tres formas distintas ante credenciales válidas:
 *  - `code_required`: se ha enviado un código 2FA por email/SMS.
 *  - `select_org`: el usuario pertenece a varias organizaciones; hay que elegir
 *    y volver a llamar a `login` con la organización seleccionada.
 *  - `session`: sin 2FA; el backend devuelve JWT directamente.
 */
export type LoginResult =
  | { kind: 'code_required' }
  | { kind: 'select_org'; orgs: Organization[] }
  | { kind: 'session'; session: AuthSession }

export interface IAuthRepository {
  /**
   * Primer paso del login: valida credenciales. Puede devolver estado de "envío
   * de código 2FA", "selección de organización" o sesión ya autenticada.
   */
  login(email: string, password: string, organization?: string): Promise<LoginResult>
  /**
   * Segundo paso del login (2FA): valida el código recibido y, si es correcto,
   * devuelve la sesión autenticada. Reenvía password y organization al backend.
   */
  validateCode(
    email: string,
    code: string,
    password: string,
    organization?: string,
  ): Promise<AuthSession>
  /**
   * Best-effort: pide al backend que emita una cookie HttpOnly de SSO. Falla
   * silenciosamente si el navegador/servidor no permite establecerla.
   */
  setSsoCookie(token: string): Promise<void>
  /**
   * Confirma con el backend (GET /login/session/current) que la sesión guardada
   * sigue viva. Devuelve la sesión (posiblemente refrescada) si el backend la
   * acepta, o `null` si la ha rechazado. Pensada para el primer render tras F5.
   */
  verifySession(): Promise<AuthSession | null>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  /**
   * Variante síncrona: devuelve el usuario en curso sin await, pensada para el
   * primer render en cliente (evita el flash "invitado → cuenta").
   */
  getCurrentUserSync(): User | null
}
