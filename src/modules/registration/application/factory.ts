import { InMemoryRegistrationRepository } from '../infrastructure/InMemoryRegistrationRepository'
import { Register } from './Register'
import { SetPassword } from './SetPassword'

const registrationRepository = new InMemoryRegistrationRepository()

export const registrationUseCases = {
  register: new Register(registrationRepository),
  setPassword: new SetPassword(registrationRepository),
}
