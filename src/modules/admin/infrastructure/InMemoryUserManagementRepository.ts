import { ManagedUser, type ManagedUserPrimitive } from '../domain/ManagedUser'
import type { IUserManagementRepository } from '../domain/IUserManagementRepository'

/**
 * Muestra de prototipo alineada con el shape real de `admin/management/user`.
 * Dos organizaciones de ejemplo para poder probar el selector sin backend.
 */
const ORG_A = '6a26ecd8ad3e05ec49a29ece'
const ORG_B = '6a425057e152d43fb1d5d645'

const USERS: ManagedUserPrimitive[] = [
  { id: 'u1', email: 'toni.vilalta@amplifysoft.io', isFullAdmin: true, organizations: [ORG_A, ORG_B], roleIds: [] },
  { id: 'u2', email: 'magda.perez@gestmusic.es', isFullAdmin: false, organizations: [ORG_A], roleIds: [] },
  { id: 'u3', email: 'claudia.hosta@gestmusic.es', isFullAdmin: false, organizations: [ORG_B], roleIds: [] },
  { id: 'u4', email: 'anna.bello@gestmusic.es', isFullAdmin: false, organizations: [ORG_A, ORG_B], roleIds: ['role-1'] },
]

export class InMemoryUserManagementRepository implements IUserManagementRepository {
  async getAllUsers(_token: string): Promise<ManagedUser[]> {
    return USERS.map(ManagedUser.fromPrimitive)
  }
}
