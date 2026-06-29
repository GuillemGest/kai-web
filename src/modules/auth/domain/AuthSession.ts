import { User, type UserPrimitive } from './User'

export interface AuthSessionPrimitive {
  user: UserPrimitive
  token: string
}

export class AuthSession {
  constructor(
    readonly user: User,
    readonly token: string,
  ) {}

  static fromPrimitive(data: AuthSessionPrimitive): AuthSession {
    return new AuthSession(User.fromPrimitive(data.user), data.token)
  }

  toPrimitive(): AuthSessionPrimitive {
    return { user: this.user.toPrimitive(), token: this.token }
  }
}
