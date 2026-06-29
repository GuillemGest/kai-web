import type { AuthSession } from './AuthSession'
import type { User } from './User'

export interface IAuthRepository {
  login(email: string, password: string): Promise<AuthSession>
  logout(): Promise<void>
  getCurrentUser(): Promise<User | null>
}
