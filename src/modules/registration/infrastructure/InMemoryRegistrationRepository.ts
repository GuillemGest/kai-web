import type { IRegistrationRepository } from '../domain/IRegistrationRepository'
import type { Password } from '../domain/Password'
import type { RegistrationData } from '../domain/RegistrationData'

/**
 * Repositorio de registro de prototipo: simula el alta pendiente de confirmación
 * y el establecimiento de contraseña. Se sustituirá por la implementación real
 * (backend de Amplify) sin tocar use cases ni UI.
 */
export class InMemoryRegistrationRepository implements IRegistrationRepository {
  async register(_data: RegistrationData): Promise<void> {
    // Simula el alta pendiente + envío del correo de confirmación.
  }

  async setPassword(_email: string, _password: Password): Promise<void> {
    // Simula la confirmación de la cuenta con la contraseña elegida.
  }
}
