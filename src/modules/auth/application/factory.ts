import { InMemoryAuthRepository } from '../infrastructure/InMemoryAuthRepository'
import { InMemoryDeviceSessionRepository } from '../infrastructure/InMemoryDeviceSessionRepository'
import { GetActiveSessions } from './GetActiveSessions'
import { GetCurrentUser } from './GetCurrentUser'
import { Login } from './Login'
import { Logout } from './Logout'

const authRepository = new InMemoryAuthRepository()
const deviceSessionRepository = new InMemoryDeviceSessionRepository()

export const authUseCases = {
  login: new Login(authRepository),
  logout: new Logout(authRepository),
  getCurrentUser: new GetCurrentUser(authRepository),
  getActiveSessions: new GetActiveSessions(deviceSessionRepository),
}
