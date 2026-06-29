// Shared auth utilities for edge functions.
// Role definitions live exclusively in src/domain/entities/Organization.ts;
// canManageMemberships is re-exported from there so this file stays DRY.
// The Supabase gateway verifies JWT signatures before invoking functions, so
// getUserIdFromJwt only needs to extract the already-trusted subject.

export { canManageMemberships } from '../../../src/domain/entities/Organization.ts'

// Returns the user id (sub) from the Authorization header, or null if absent/malformed.
export function getUserIdFromJwt(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice('Bearer '.length)
  const payload = token.split('.')[1]
  if (!payload) return null
  try {
    const json = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
    return typeof json.sub === 'string' ? json.sub : null
  } catch {
    return null
  }
}
