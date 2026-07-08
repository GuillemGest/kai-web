import { TeamMember, type TeamMemberPrimitive } from './TeamMember'

export interface TeamPrimitive {
  organizationId: string
  /** Nombre de la organización / productora. */
  name: string
  /** Asientos contratados en el plan (total de licencias). */
  seatsTotal: number
  members: TeamMemberPrimitive[]
}

export class Team {
  constructor(
    readonly organizationId: string,
    readonly name: string,
    readonly seatsTotal: number,
    readonly members: TeamMember[],
  ) {}

  /** Asientos ocupados: miembros activos o con invitación pendiente. */
  get seatsUsed(): number {
    return this.members.length
  }

  get seatsAvailable(): number {
    return Math.max(0, this.seatsTotal - this.seatsUsed)
  }

  static fromPrimitive(data: TeamPrimitive): Team {
    return new Team(
      data.organizationId,
      data.name,
      data.seatsTotal,
      data.members.map(TeamMember.fromPrimitive),
    )
  }

  toPrimitive(): TeamPrimitive {
    return {
      organizationId: this.organizationId,
      name: this.name,
      seatsTotal: this.seatsTotal,
      members: this.members.map((m) => m.toPrimitive()),
    }
  }
}
