import type { IAuthRepository } from '../domain/IAuthRepository'

export class Logout {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): Promise<void> {
    return this.repository.logout()
  }
}
