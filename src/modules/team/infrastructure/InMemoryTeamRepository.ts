import type { ITeamRepository } from '../domain/ITeamRepository'
import { Team, type TeamPrimitive } from '../domain/Team'

/**
 * Equipo/organización de prototipo (datos mock en memoria).
 * Modela una productora B2B con varios miembros y un número de asientos
 * contratados. Se sustituirá por SupabaseTeamRepository sin tocar use cases ni UI.
 */
const TEAM: TeamPrimitive = {
  organizationId: 'org-1',
  name: 'Estudio Demo',
  seatsTotal: 5,
  members: [
    {
      id: 'member-1',
      organizationId: 'org-1',
      name: 'Usuario Demo',
      email: 'demo@kai.app',
      role: 'owner',
      status: 'active',
      joinedAt: '2026-01-15T10:00:00.000Z',
    },
    {
      id: 'member-2',
      organizationId: 'org-1',
      name: 'Marta Ferrer',
      email: 'marta@estudiodemo.tv',
      role: 'admin',
      status: 'active',
      joinedAt: '2026-02-03T10:00:00.000Z',
    },
    {
      id: 'member-3',
      organizationId: 'org-1',
      name: 'Ignasi Roca',
      email: 'ignasi@estudiodemo.tv',
      role: 'editor',
      status: 'active',
      joinedAt: '2026-02-20T10:00:00.000Z',
    },
    {
      id: 'member-4',
      organizationId: 'org-1',
      name: 'Laura Vidal',
      email: 'laura@estudiodemo.tv',
      role: 'editor',
      status: 'invited',
      joinedAt: '2026-06-28T10:00:00.000Z',
    },
  ],
}

/** Mapa usuario → organización. En el prototipo solo hay un usuario y un equipo. */
const USER_TO_ORG: Record<string, string> = {
  'user-1': 'org-1',
}

export class InMemoryTeamRepository implements ITeamRepository {
  async getByUser(userId: string): Promise<Team | null> {
    const orgId = USER_TO_ORG[userId]
    return orgId === TEAM.organizationId ? Team.fromPrimitive(TEAM) : null
  }
}
