export type TeamRole = 'owner' | 'admin' | 'editor'
export type MemberStatus = 'active' | 'invited'

export interface TeamMemberPrimitive {
  id: string
  /** Id de la organización (productora) a la que pertenece el miembro. */
  organizationId: string
  name: string
  email: string
  role: TeamRole
  status: MemberStatus
  /** Fecha ISO en que se unió (o se invitó) al equipo. */
  joinedAt: string
}

export class TeamMember {
  constructor(
    readonly id: string,
    readonly organizationId: string,
    readonly name: string,
    readonly email: string,
    readonly role: TeamRole,
    readonly status: MemberStatus,
    readonly joinedAt: string,
  ) {}

  get isPending(): boolean {
    return this.status === 'invited'
  }

  static fromPrimitive(data: TeamMemberPrimitive): TeamMember {
    return new TeamMember(
      data.id,
      data.organizationId,
      data.name,
      data.email,
      data.role,
      data.status,
      data.joinedAt,
    )
  }

  toPrimitive(): TeamMemberPrimitive {
    return {
      id: this.id,
      organizationId: this.organizationId,
      name: this.name,
      email: this.email,
      role: this.role,
      status: this.status,
      joinedAt: this.joinedAt,
    }
  }
}
