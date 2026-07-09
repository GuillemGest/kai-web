import type { IAuthRepository } from '../domain/IAuthRepository'

/**
 * Primer paso del login (2FA): valida credenciales y dispara el envío del
 * código de verificación. No devuelve sesión; ese es el cometido de
 * {@link ValidateLoginCode}.
 */
export class Login {
  constructor(private readonly repository: IAuthRepository) {}

  execute(email: string, password: string): Promise<void> {
    return this.repository.login(email, password)
  }
}
