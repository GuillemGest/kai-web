import type { IUserManagementRepository } from '../domain/IUserManagementRepository'
import type { ManagedUser } from '../domain/ManagedUser'

/**
 * Obtiene todos los usuarios gestionables de la plataforma.
 *
 * El filtrado por organización se resuelve en la capa de presentación a partir
 * de este listado (cada usuario declara sus `organizations`), evitando ir al
 * backend cada vez que el usuario cambia de organización en el selector.
 */
export class GetManagedUsers {
  constructor(private readonly repository: IUserManagementRepository) {}

  execute(token: string): Promise<ManagedUser[]> {
    return this.repository.getAllUsers(token)
  }
}
