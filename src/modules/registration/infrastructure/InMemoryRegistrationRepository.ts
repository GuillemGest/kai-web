import { AuthSession } from '../../auth/domain/AuthSession'
import type { UserPrimitive } from '../../auth/domain/User'
import type { IRegistrationRepository } from '../domain/IRegistrationRepository'
import type { RegistrationData } from '../domain/RegistrationData'

/**
 * Repositorio de registro de prototipo: simula el alta y autentica en memoria.
 * Se sustituirá por SupabaseRegistrationRepository sin tocar use cases ni UI.
 */
export class InMemoryRegistrationRepository implements IRegistrationRepository {
  async register(data: RegistrationData): Promise<AuthSession> {
    const user: UserPrimitive = {
      id: 'user-' + Date.now(),
      email: data.email,
      name: `${data.firstName} ${data.lastName}`.trim(),
      createdAt: new Date().toISOString(),
    }
    return AuthSession.fromPrimitive({ user, token: 'mock-token' })
  }
}
