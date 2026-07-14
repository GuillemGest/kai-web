import type { IRegistrationRepository } from '../domain/IRegistrationRepository'
import type { RegistrationData } from '../domain/RegistrationData'

export class Register {
  constructor(private readonly repository: IRegistrationRepository) {}

  execute(data: RegistrationData): Promise<void> {
    return this.repository.register(data)
  }
}
