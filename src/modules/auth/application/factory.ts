import { HttpAuthRepository } from '../infrastructure/HttpAuthRepository'
import { InMemoryDeviceSessionRepository } from '../infrastructure/InMemoryDeviceSessionRepository'
import { GetActiveSessions } from './GetActiveSessions'
import { GetCurrentUser } from './GetCurrentUser'
import { GetCurrentUserSync } from './GetCurrentUserSync'
import { Login } from './Login'
import { Logout } from './Logout'
import { ValidateLoginCode } from './ValidateLoginCode'

const authRepository = new HttpAuthRepository()
const deviceSessionRepository = new InMemoryDeviceSessionRepository()

export const authUseCases = {
  login: new Login(authRepository),
  validateLoginCode: new ValidateLoginCode(authRepository),
  logout: new Logout(authRepository),
  getCurrentUser: new GetCurrentUser(authRepository),
  getCurrentUserSync: new GetCurrentUserSync(authRepository),
  getActiveSessions: new GetActiveSessions(deviceSessionRepository),
}
