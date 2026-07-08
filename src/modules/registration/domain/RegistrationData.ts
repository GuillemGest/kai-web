export interface RegistrationDataPrimitive {
  firstName: string
  lastName: string
  company: string
  email: string
  phone: string
  country: string
  street: string
  city: string
  region: string
  postalCode: string
}

export class RegistrationData {
  constructor(
    readonly firstName: string,
    readonly lastName: string,
    readonly company: string,
    readonly email: string,
    readonly phone: string,
    readonly country: string,
    readonly street: string,
    readonly city: string,
    readonly region: string,
    readonly postalCode: string,
  ) {}

  static fromPrimitive(data: RegistrationDataPrimitive): RegistrationData {
    return new RegistrationData(
      data.firstName,
      data.lastName,
      data.company,
      data.email,
      data.phone,
      data.country,
      data.street,
      data.city,
      data.region,
      data.postalCode,
    )
  }

  toPrimitive(): RegistrationDataPrimitive {
    return {
      firstName: this.firstName,
      lastName: this.lastName,
      company: this.company,
      email: this.email,
      phone: this.phone,
      country: this.country,
      street: this.street,
      city: this.city,
      region: this.region,
      postalCode: this.postalCode,
    }
  }
}
