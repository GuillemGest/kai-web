export interface OrganizationPrimitive {
  id: string
  name: string
}

export class Organization {
  constructor(
    readonly id: string,
    readonly name: string,
  ) {}

  static fromPrimitive(data: OrganizationPrimitive): Organization {
    return new Organization(data.id, data.name)
  }

  toPrimitive(): OrganizationPrimitive {
    return { id: this.id, name: this.name }
  }
}
