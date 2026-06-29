export type OperatingSystem = 'windows' | 'macos' | 'linux'

export interface DownloadBuildPrimitive {
  id: string
  productId: string
  os: OperatingSystem
  version: string
  fileUrl: string
  releasedAt: string
}

export class DownloadBuild {
  constructor(
    readonly id: string,
    readonly productId: string,
    readonly os: OperatingSystem,
    readonly version: string,
    readonly fileUrl: string,
    readonly releasedAt: string,
  ) {}

  static fromPrimitive(data: DownloadBuildPrimitive): DownloadBuild {
    return new DownloadBuild(
      data.id,
      data.productId,
      data.os,
      data.version,
      data.fileUrl,
      data.releasedAt,
    )
  }

  toPrimitive(): DownloadBuildPrimitive {
    return {
      id: this.id,
      productId: this.productId,
      os: this.os,
      version: this.version,
      fileUrl: this.fileUrl,
      releasedAt: this.releasedAt,
    }
  }
}
