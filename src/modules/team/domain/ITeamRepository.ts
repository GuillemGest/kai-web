import type { Team } from './Team'

export interface ITeamRepository {
  /** Equipo (organización) al que pertenece el usuario; `null` si no forma parte de ninguno. */
  getByUser(userId: string): Promise<Team | null>
}
