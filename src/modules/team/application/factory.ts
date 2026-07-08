import { InMemoryTeamRepository } from '../infrastructure/InMemoryTeamRepository'
import { GetTeam } from './GetTeam'

const teamRepository = new InMemoryTeamRepository()

export const teamUseCases = {
  getTeam: new GetTeam(teamRepository),
}
