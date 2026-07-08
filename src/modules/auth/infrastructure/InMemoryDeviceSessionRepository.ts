import { DeviceSession, type DeviceSessionPrimitive } from '../domain/DeviceSession'
import type { IDeviceSessionRepository } from '../domain/IDeviceSessionRepository'

/**
 * Sesiones/dispositivos activos de prototipo (datos mock en memoria).
 * Se sustituirá por SupabaseDeviceSessionRepository sin tocar use cases ni UI.
 */
const SESSIONS: DeviceSessionPrimitive[] = [
  {
    id: 'sess-1',
    userId: 'user-1',
    device: 'MacBook Pro · Chrome',
    platform: 'macos',
    location: 'Barcelona, ES',
    lastActiveAt: '2026-07-08T08:40:00.000Z',
    current: true,
  },
  {
    id: 'sess-2',
    userId: 'user-1',
    device: 'Plugin KAI · Premiere Pro',
    platform: 'windows',
    location: 'Madrid, ES',
    lastActiveAt: '2026-07-07T17:12:00.000Z',
    current: false,
  },
  {
    id: 'sess-3',
    userId: 'user-1',
    device: 'iPad · Safari',
    platform: 'web',
    location: 'Barcelona, ES',
    lastActiveAt: '2026-07-02T21:05:00.000Z',
    current: false,
  },
]

export class InMemoryDeviceSessionRepository implements IDeviceSessionRepository {
  async listByUser(userId: string): Promise<DeviceSession[]> {
    return SESSIONS.filter((s) => s.userId === userId)
      .sort((a, b) => Number(b.current) - Number(a.current) || b.lastActiveAt.localeCompare(a.lastActiveAt))
      .map(DeviceSession.fromPrimitive)
  }
}
