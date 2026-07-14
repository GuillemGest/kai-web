export interface RegistrationDataPrimitive {
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
  acceptsTerms: boolean
  acceptsNewsletter: boolean
}

export class RegistrationData {
  constructor(
    readonly firstName: string,
    readonly lastName: string,
    readonly company: string,
    readonly email: string,
    readonly phone: string,
    readonly acceptsTerms: boolean,
    readonly acceptsNewsletter: boolean,
  ) {}

  static fromPrimitive(data: RegistrationDataPrimitive): RegistrationData {
    return new RegistrationData(
      data.firstName,
      data.lastName,
      data.company,
      data.email,
      data.phone,
      data.acceptsTerms,
      data.acceptsNewsletter,
    )
  }

  toPrimitive(): RegistrationDataPrimitive {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      company: this.company,
      email: this.email,
      phone: this.phone,
      acceptsTerms: this.acceptsTerms,
      acceptsNewsletter: this.acceptsNewsletter,
    }
  }
}
