import type { IRegistrationRepository } from '../domain/IRegistrationRepository'
import { Password } from '../domain/Password'

/**
 * Confirma la cuenta estableciendo su contraseña. La validación de la política
 * de contraseña vive en el Value Object `Password` (lanza WeakPasswordError).
 */
export class SetPassword {
  constructor(private readonly repository: IRegistrationRepository) {}

  execute(email: string, rawPassword: string): Promise<void> {
    const password = Password.fromString(rawPassword)
    return this.repository.setPassword(email, password)
  }
}
