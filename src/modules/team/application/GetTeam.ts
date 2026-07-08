import type { ITeamRepository } from '../domain/ITeamRepository'
import type { Team } from '../domain/Team'

export class GetTeam {
  constructor(private readonly repository: ITeamRepository) {}

  execute(userId: string): Promise<Team | null> {
    return this.repository.getByUser(userId)
  }
}
