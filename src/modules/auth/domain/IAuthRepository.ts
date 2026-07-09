import type { AuthSession } from './AuthSession'
import type { User } from './User'

export interface IAuthRepository {
  /**
   * Primer paso del login (2FA): valida las credenciales y dispara el envío del
   * código de verificación al usuario. No devuelve sesión todavía; la sesión
   * solo se obtiene tras validar el código con {@link validateCode}.
   */
  login(email: string, password: string): Promise<void>
  /**
   * Segundo paso del login (2FA): valida el código recibido y, si es correcto,
   * devuelve la sesión autenticada.
   */
  validateCode(email: string, code: string): Promise<AuthSession>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
  /**
   * Variante síncrona de {@link getCurrentUser}: devuelve el usuario en curso
   * sin esperar a una promesa. Pensada para el primer render en cliente (evita
   * el flash "invitado → cuenta"). El origen de la sesión (localStorage hoy)
   * queda encapsulado aquí; un backend con red no podría ofrecerla y devolvería
   * `null` hasta resolver por la vía async.
   */
  getCurrentUserSync(): User | null
}
