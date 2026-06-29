export interface UserPrimitive {
  id: string
  email: string
  name: string
  createdAt: string
}

export class User {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly name: string,
    readonly createdAt: string,
  ) {}

  static fromPrimitive(data: UserPrimitive): User {
    return new User(data.id, data.email, data.name, data.createdAt)
  }

  toPrimitive(): UserPrimitive {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      createdAt: this.createdAt,
    }
  }
}
