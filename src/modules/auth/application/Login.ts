import type { AuthSession } from '../domain/AuthSession'
import type { IAuthRepository } from '../domain/IAuthRepository'

export class Login {
  constructor(private readonly repository: IAuthRepository) {}

  execute(email: string, password: string): Promise<AuthSession> {
    return this.repository.login(email, password)
  }
}
