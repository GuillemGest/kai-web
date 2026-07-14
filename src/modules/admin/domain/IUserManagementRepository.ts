import type { ManagedUser } from './ManagedUser'

export interface IUserManagementRepository {
  /**
   * Lista todos los usuarios de la plataforma. Requiere el JWT de un usuario con
   * permisos de administración; el backend lo valida y responde con el listado
   * completo (el filtrado por organización se hace en la capa de aplicación/UI).
   */
  getAllUsers(token: string): Promise<ManagedUser[]>
}
