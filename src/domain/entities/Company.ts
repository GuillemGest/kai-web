// A "company" is the Stripe-focused view over an organization. Its id is the
// organization id (companyId === organizationId); courses link to it via
// courses.organization_id. The Stripe state lives on the organizations table.
export interface Company {
  id: string                       // === organization id
  name: string
  stripeAccountId?: string
  stripeOnboardingComplete: boolean
  // null/undefined ⇒ use the platform default (PLATFORM_FEE_PERCENTAGE env var)
  platformFeePercentage?: number
}

export interface CompanyOnboardingStatus {
  complete: boolean
  stripeAccountId?: string
}
