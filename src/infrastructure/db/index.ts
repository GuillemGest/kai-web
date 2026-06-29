import { SupabaseCourseRepository } from '../repositories/SupabaseCourseRepository'
import { SupabaseEnrollmentRepository } from '../repositories/SupabaseEnrollmentRepository'
import { SupabaseInfoRequestRepository } from '../repositories/SupabaseInfoRequestRepository'
import { SupabaseTeacherRepository } from '../repositories/SupabaseTeacherRepository'
import { SupabaseCompanyRepository } from '../repositories/SupabaseCompanyRepository'
import type { ICourseRepository } from '../../application/ports/ICourseRepository'
import type { IAdminRepository } from '../../application/ports/IAdminRepository'
import type { IEnrollmentRepository } from '../../application/ports/IEnrollmentRepository'
import type { IInfoRequestRepository } from '../../application/ports/IInfoRequestRepository'
import type { ITeacherRepository } from '../../application/ports/ITeacherRepository'
import type { ICompanyRepository } from '../../application/ports/ICompanyRepository'

const repo = new SupabaseCourseRepository()

export const courseRepository: ICourseRepository = repo
export const adminRepository: IAdminRepository = repo
export const enrollmentRepository: IEnrollmentRepository = new SupabaseEnrollmentRepository()
export const infoRequestRepository: IInfoRequestRepository = new SupabaseInfoRequestRepository()
export const teacherRepository: ITeacherRepository = new SupabaseTeacherRepository()
export const companyRepository: ICompanyRepository = new SupabaseCompanyRepository()
