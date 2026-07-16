import type { IAuthRepository } from '../domain/IAuthRepository'

/**
 * Quita una cuenta del roster local (`kai_saved_accounts`). No revoca tokens
 * en el backend ni afecta a la sesión activa: solo desaparece del selector
 * del header.
 */
export class RemoveSavedAccount {
  constructor(private readonly repository: IAuthRepository) {}

  execute(email: string, organizationId?: string): void {
    this.repository.removeSavedAccount(email, organizationId)
  }
}
