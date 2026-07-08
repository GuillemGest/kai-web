export type DevicePlatform = 'macos' | 'windows' | 'web'

export interface DeviceSessionPrimitive {
  id: string
  userId: string
  /** Etiqueta legible del dispositivo (p. ej. "MacBook Pro · Chrome"). */
  device: string
  platform: DevicePlatform
  /** Ubicación aproximada por IP (p. ej. "Barcelona, ES"). */
  location: string
  /** Última actividad registrada, ISO 8601. */
  lastActiveAt: string
  /** `true` si es la sesión desde la que se está navegando ahora. */
  current: boolean
}

export class DeviceSession {
  constructor(
    readonly id: string,
    readonly userId: string,
    readonly device: string,
    readonly platform: DevicePlatform,
    readonly location: string,
    readonly lastActiveAt: string,
    readonly current: boolean,
  ) {}

  static fromPrimitive(data: DeviceSessionPrimitive): DeviceSession {
    return new DeviceSession(
      data.id,
      data.userId,
      data.device,
      data.platform,
      data.location,
      data.lastActiveAt,
      data.current,
    )
  }

  toPrimitive(): DeviceSessionPrimitive {
    return {
      id: this.id,
      userId: this.userId,
      device: this.device,
      platform: this.platform,
      location: this.location,
      lastActiveAt: this.lastActiveAt,
      current: this.current,
    }
  }
}
