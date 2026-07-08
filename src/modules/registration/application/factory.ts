import { InMemoryRegistrationRepository } from '../infrastructure/InMemoryRegistrationRepository'
import { Register } from './Register'

const registrationRepository = new InMemoryRegistrationRepository()

export const registrationUseCases = {
  register: new Register(registrationRepository),
}
