export interface EnrollmentData {
  courseId: number
  userId: string | null
  name: string
  surnames: string
  email: string
  phone: string | null
}

export interface IEnrollmentRepository {
  submit(data: EnrollmentData): Promise<void>
  getEnrolledIds(userId: string): Promise<number[]>
  /** Fecha de adquisición (ISO) por curso para un usuario: courseId → fecha */
  getEnrolledDates(userId: string): Promise<Record<number, string>>
}
