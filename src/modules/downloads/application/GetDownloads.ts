import type { DownloadBuild } from '../domain/DownloadBuild'
import type { IDownloadRepository } from '../domain/IDownloadRepository'

export class GetDownloads {
  constructor(private readonly repository: IDownloadRepository) {}

  execute(productId: string): Promise<DownloadBuild[]> {
    return this.repository.getByProduct(productId)
  }
}
