import type { ManagedUser } from './ManagedUser'

/**
 * Ids de organización presentes en un listado de usuarios, sin duplicados y
 * ordenados de forma estable. Alimenta el selector de organización del panel.
 */
export function organizationIdsOf(users: readonly ManagedUser[]): string[] {
  const ids = new Set<string>()
  for (const user of users) {
    for (const orgId of user.organizations) ids.add(orgId)
  }
  return [...ids].sort()
}

/**
 * ¿El email dado corresponde a un full admin dentro del listado? Determina el
 * acceso a los paneles restringidos (facturación y administración de usuarios).
 * Un no-admin no puede descargar el listado (el endpoint es admin-only), por lo
 * que con lista vacía el resultado es `false`.
 */
export function isFullAdminEmail(users: readonly ManagedUser[], email: string): boolean {
  return users.some((user) => user.email === email && user.isFullAdmin)
}

/** Usuarios que pertenecen a la organización dada. */
export function usersInOrganization(
  users: readonly ManagedUser[],
  organizationId: string,
): ManagedUser[] {
  return users.filter((user) => user.belongsTo(organizationId))
}
