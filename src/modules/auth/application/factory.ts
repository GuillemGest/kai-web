import { InMemoryAuthRepository } from '../infrastructure/InMemoryAuthRepository'
import { GetCurrentUser } from './GetCurrentUser'
import { Login } from './Login'
import { Logout } from './Logout'

const authRepository = new InMemoryAuthRepository()

export const authUseCases = {
  login: new Login(authRepository),
  logout: new Logout(authRepository),
  getCurrentUser: new GetCurrentUser(authRepository),
}
