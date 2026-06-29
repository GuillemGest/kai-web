import type { Plan } from './Plan'

export interface IPlanRepository {
  getAll(): Promise<Plan[]>
}
