import { InMemoryResourceRepository } from '../infrastructure/InMemoryResourceRepository'
import { GetResources } from './GetResources'

const resourceRepository = new InMemoryResourceRepository()

export const resourceUseCases = {
  getResources: new GetResources(resourceRepository),
}
