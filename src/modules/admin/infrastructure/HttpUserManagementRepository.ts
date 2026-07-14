import { ManagedUser, type ManagedUserPrimitive } from '../domain/ManagedUser'
import type { IUserManagementRepository } from '../domain/IUserManagementRepository'
import { AUTH_API_BASE } from '../../../config/appUrls'

interface ManagementUserResponse {
  success: boolean
  message?: ManagedUserPrimitive[] | string
}

/**
 * Repositorio de administración de usuarios contra el backend real.
 *
 * Contrato: `GET /admin/management/user` con `Authorization: Bearer <JWT>` →
 * `{ success, message: ManagedUserPrimitive[] }`. El backend responde 200 aunque
 * `success` sea false, así que hay que comprobar la bandera.
 */
export class HttpUserManagementRepository implements IUserManagementRepository {
  async getAllUsers(token: string): Promise<ManagedUser[]> {
    const res = await fetch(`${AUTH_API_BASE}/admin/management/user`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      credentials: 'include',
    })

    if (!res.ok) throw new Error(`getAllUsers failed (${res.status})`)

    const data = (await res.json()) as ManagementUserResponse
    if (!data.success || !Array.isArray(data.message)) {
      throw new Error('getAllUsers: respuesta inválida del backend')
    }

    return data.message.map(ManagedUser.fromPrimitive)
  }
}
