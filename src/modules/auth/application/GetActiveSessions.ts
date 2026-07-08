import type { DeviceSession } from '../domain/DeviceSession'
import type { IDeviceSessionRepository } from '../domain/IDeviceSessionRepository'

export class GetActiveSessions {
  constructor(private readonly repository: IDeviceSessionRepository) {}

  execute(userId: string): Promise<DeviceSession[]> {
    return this.repository.listByUser(userId)
  }
}
