import { HttpUserManagementRepository } from '../infrastructure/HttpUserManagementRepository'
import { GetManagedUsers } from './GetManagedUsers'

const userManagementRepository = new HttpUserManagementRepository()

export const adminUseCases = {
  getManagedUsers: new GetManagedUsers(userManagementRepository),
}
