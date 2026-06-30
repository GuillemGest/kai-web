import type { Resource } from './Resource'

export interface IResourceRepository {
  getResources(): Promise<Resource[]>
}
