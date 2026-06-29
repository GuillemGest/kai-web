import type { DownloadBuild } from './DownloadBuild'

export interface IDownloadRepository {
  getByProduct(productId: string): Promise<DownloadBuild[]>
}
