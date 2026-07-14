import { DevBypassAuthRepository } from '../infrastructure/DevBypassAuthRepository'
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

// ⚠️ PROVISIONAL: el decorator añade un "entrar mock" (sesión de desarrollo sin
// credenciales) para probar el flujo. Para volver al login real puro, usar
// directamente `new HttpAuthRepository()` y borrar DevBypassAuthRepository.
const devAuthRepository = new DevBypassAuthRepository(new HttpAuthRepository())
const authRepository = devAuthRepository
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
  // ⚠️ PROVISIONAL: crea una sesión de desarrollo al instante. Quitar con el
  // botón mock del login antes de producción.
  loginMock: () => devAuthRepository.loginMock(),
}
