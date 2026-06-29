import { DownloadBuild, type DownloadBuildPrimitive } from '../domain/DownloadBuild'
import type { IDownloadRepository } from '../domain/IDownloadRepository'

const BUILDS: DownloadBuildPrimitive[] = [
  {
    id: 'kai-win',
    productId: 'kai',
    os: 'windows',
    version: '1.0.0',
    fileUrl: '#',
    releasedAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'kai-mac',
    productId: 'kai',
    os: 'macos',
    version: '1.0.0',
    fileUrl: '#',
    releasedAt: '2026-06-01T00:00:00.000Z',
  },
  {
    id: 'kai-linux',
    productId: 'kai',
    os: 'linux',
    version: '1.0.0',
    fileUrl: '#',
    releasedAt: '2026-06-01T00:00:00.000Z',
  },
]

export class InMemoryDownloadRepository implements IDownloadRepository {
  async getByProduct(productId: string): Promise<DownloadBuild[]> {
    return BUILDS.filter((b) => b.productId === productId).map(DownloadBuild.fromPrimitive)
  }
}
