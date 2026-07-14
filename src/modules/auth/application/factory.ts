import { HttpAuthRepository } from '../infrastructure/HttpAuthRepository'
import { InMemoryDeviceSessionRepository } from '../infrastructure/InMemoryDeviceSessionRepository'
import { GetActiveSessions } from './GetActiveSessions'
import { GetCurrentSessionSync } from './GetCurrentSessionSync'
import { GetCurrentUser } from './GetCurrentUser'
import { GetCurrentUserSync } from './GetCurrentUserSync'
import { Login } from './Login'
import { Logout } from './Logout'
import { PreparePanelHandoff } from './PreparePanelHandoff'
import { ValidateLoginCode } from './ValidateLoginCode'
import { VerifyCurrentSession } from './VerifyCurrentSession'

const authRepository = new HttpAuthRepository()
const deviceSessionRepository = new InMemoryDeviceSessionRepository()

export const authUseCases = {
  login: new Login(authRepository),
  validateLoginCode: new ValidateLoginCode(authRepository),
  logout: new Logout(authRepository),
  getCurrentUser: new GetCurrentUser(authRepository),
  getCurrentUserSync: new GetCurrentUserSync(authRepository),
  getCurrentSessionSync: new GetCurrentSessionSync(authRepository),
  verifyCurrentSession: new VerifyCurrentSession(authRepository),
  preparePanelHandoff: new PreparePanelHandoff(authRepository),
  getActiveSessions: new GetActiveSessions(deviceSessionRepository),
}
