import type { IPlanRepository } from '../domain/IPlanRepository'
import type { Plan } from '../domain/Plan'

export class GetPlans {
  constructor(private readonly repository: IPlanRepository) {}

  execute(): Promise<Plan[]> {
    return this.repository.getAll()
  }
}
