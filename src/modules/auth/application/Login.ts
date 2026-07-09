import type { IAuthRepository, LoginResult } from '../domain/IAuthRepository'

/**
 * Primer paso del login: valida credenciales contra el backend Amplify.
 * Devuelve un discriminated union según la rama tomada por el backend
 * (código 2FA enviado, selección de organización o sesión directa).
 */
export class Login {
  constructor(private readonly repository: IAuthRepository) {}

  execute(email: string, password: string, organization?: string): Promise<LoginResult> {
    return this.repository.login(email, password, organization)
  }
}
