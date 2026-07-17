import type { AuthSession } from '../domain/AuthSession'
import type { Organization } from '../domain/Organization'
import type { IAuthRepository } from '../domain/IAuthRepository'

/**
 * Segundo paso del login (2FA): valida el código, obtiene la sesión y dispara
 * el `set/cookie` de SSO en best-effort. `organization` es la entidad
 * completa (id + name) para poder persistir el nombre en cliente.
 */
export class ValidateLoginCode {
  constructor(private readonly repository: IAuthRepository) {}

  async execute(
    email: string,
    code: string,
    password: string,
    organization?: Organization,
  ): Promise<AuthSession> {
    const session = await this.repository.validateCode(email, code, password, organization)
    await this.repository.setSsoCookie(session.token)
    return session
  }
}
