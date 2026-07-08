import type { DeviceSession } from './DeviceSession'

export interface IDeviceSessionRepository {
  /** Sesiones/dispositivos activos del usuario, la actual primero. */
  listByUser(userId: string): Promise<DeviceSession[]>
}
