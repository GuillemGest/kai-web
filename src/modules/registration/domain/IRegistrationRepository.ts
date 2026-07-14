import type { Password } from './Password'
import type { RegistrationData } from './RegistrationData'

export interface IRegistrationRepository {
  /**
   * Da de alta la cuenta en estado pendiente y envía el correo de confirmación
   * (confirmar email + crear contraseña). No crea sesión: el login es manual
   * una vez confirmada la cuenta.
   */
  register(data: RegistrationData): Promise<void>

  /** Confirma la cuenta estableciendo su contraseña. */
  setPassword(email: string, password: Password): Promise<void>
}
