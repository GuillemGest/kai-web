import type { AuthSession } from '../../auth/domain/AuthSession'
import type { RegistrationData } from './RegistrationData'

export interface IRegistrationRepository {
  register(data: RegistrationData): Promise<AuthSession>
}
