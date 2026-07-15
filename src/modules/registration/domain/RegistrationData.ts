import { Email } from './Email'
import { PhoneNumber } from './PhoneNumber'

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
    // Los value objects garantizan la invariante de formato: si el email o el
    // teléfono no son válidos, se lanza el error de dominio correspondiente.
    // `Email`/`PhoneNumber` normalizan (trim) el valor de entrada.
    const email = Email.fromString(data.email).value
    const phone = data.phone.trim() ? PhoneNumber.fromString(data.phone).value : ''
    return new RegistrationData(
      data.firstName,
      data.lastName,
      data.company,
      email,
      phone,
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
