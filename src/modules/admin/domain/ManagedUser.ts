export interface ManagedUserPrimitive {
  id: string
  email: string
  /** Administrador con acceso total a la plataforma (todas las organizaciones). */
  isFullAdmin: boolean
  /** Ids de las organizaciones a las que pertenece el usuario. */
  organizations: string[]
  /** Ids de los roles asignados (vacío si no tiene roles específicos). */
  roleIds: string[]
}

/**
 * Usuario gestionado desde el panel de administración (endpoint
 * `admin/management/user`). Es un contexto distinto al `team` de asientos: aquí
 * un usuario puede pertenecer a varias organizaciones y marcarse como full admin.
 *
 * El backend no envía nombre; lo derivamos del email para presentación.
 */
export class ManagedUser {
  constructor(
    readonly id: string,
    readonly email: string,
    readonly isFullAdmin: boolean,
    readonly organizations: string[],
    readonly roleIds: string[],
  ) {}

  /** ¿Pertenece el usuario a la organización dada? */
  belongsTo(organizationId: string): boolean {
    return this.organizations.includes(organizationId)
  }

  /**
   * Nombre presentable derivado del email (el backend no lo envía): parte local
   * del correo con puntos/guiones convertidos en espacios y capitalizada.
   * Ej. `guillem.garcia@gestmusic.es` → `Guillem Garcia`.
   */
  get derivedName(): string {
    const localPart = this.email.split('@')[0] ?? this.email
    return localPart
      .split(/[._-]+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  static fromPrimitive(data: ManagedUserPrimitive): ManagedUser {
    return new ManagedUser(
      data.id,
      data.email,
      Boolean(data.isFullAdmin),
      Array.isArray(data.organizations) ? data.organizations : [],
      Array.isArray(data.roleIds) ? data.roleIds : [],
    )
  }

  toPrimitive(): ManagedUserPrimitive {
    return {
      id: this.id,
      email: this.email,
      isFullAdmin: this.isFullAdmin,
      organizations: this.organizations,
      roleIds: this.roleIds,
    }
  }
}
