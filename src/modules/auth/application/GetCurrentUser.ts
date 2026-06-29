import type { IAuthRepository } from '../domain/IAuthRepository'
import type { User } from '../domain/User'

export class GetCurrentUser {
  constructor(private readonly repository: IAuthRepository) {}

  execute(): Promise<User | null> {
    return this.repository.getCurrentUser()
  }
}
