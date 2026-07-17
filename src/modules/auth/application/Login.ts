import type { Organization } from '../domain/Organization'
import type { IAuthRepository, LoginResult } from '../domain/IAuthRepository'

/**
 * Primer paso del login: valida credenciales contra el backend Amplify.
 * Devuelve un discriminated union según la rama tomada por el backend
 * (código 2FA enviado, selección de organización o sesión directa).
 *
 * `organization` acepta la entidad completa (id + name): al backend le
 * viaja el id, y el name se preserva para persistirlo en cliente cuando
 * el JWT no lo trae en sus claims.
 */
export class Login {
  constructor(private readonly repository: IAuthRepository) {}

  execute(
    email: string,
    password: string,
    organization?: Organization,
  ): Promise<LoginResult> {
    return this.repository.login(email, password, organization)
  }
}
