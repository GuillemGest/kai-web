import type { IResourceRepository } from '../domain/IResourceRepository'
import type { Resource } from '../domain/Resource'

export class GetResources {
  constructor(private readonly repository: IResourceRepository) {}

  execute(): Promise<Resource[]> {
    return this.repository.getResources()
  }
}
