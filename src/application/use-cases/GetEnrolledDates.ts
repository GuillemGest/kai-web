import type { IEnrollmentRepository } from '../ports/IEnrollmentRepository'

export class GetEnrolledDates {
  constructor(private readonly repo: IEnrollmentRepository) {}

  execute(userId: string): Promise<Record<number, string>> {
    return this.repo.getEnrolledDates(userId)
  }
}
