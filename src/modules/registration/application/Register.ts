import type { AuthSession } from '../../auth/domain/AuthSession'
import type { IRegistrationRepository } from '../domain/IRegistrationRepository'
import type { RegistrationData } from '../domain/RegistrationData'

export class Register {
  constructor(private readonly repository: IRegistrationRepository) {}

  execute(data: RegistrationData): Promise<AuthSession> {
    return this.repository.register(data)
  }
}
