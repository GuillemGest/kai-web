import Stripe from 'stripe'
import type { IOrganizationBillingRepository } from '../domain/IOrganizationBillingRepository'

/**
 * Implementación provisional mientras el backend Amplify no expone cómo
 * leer/persistir `stripeCustomerId` en `Organization` (ver
 * docs/billing-multi-organizacion.md §10 paso 1): en vez de crear un Customer
 * nuevo en cada request (lo que dejaría "huérfana" cualquier compra ya
 * hecha), busca en Stripe el Customer existente por
 * `metadata['organizationId']` — el mismo campo que `resolveCustomerId`
 * fija al crearlo.
 *
 * `setStripeCustomerId` sigue siendo no-op: no hay nada que persistir aquí,
 * la propia metadata de Stripe ES la fuente de verdad temporal.
 *
 * Puede haber varios Customers con la misma `organizationId` (duplicados
 * acumulados mientras no había persistencia real, uno por cada request que no
 * encontró el existente): se piden varios candidatos y se prioriza el que
 * tenga alguna suscripción (activa o no) sobre uno vacío, en vez de fiarse de
 * cuál devuelve primero la Search API. Sustituir por una implementación HTTP
 * real contra Amplify en cuanto el backend lo soporte — eso elimina tanto la
 * ambigüedad como la creación de duplicados nuevos.
 *
 * Nota: la Search API de Stripe indexa con unos segundos de retraso tras
 * crear/actualizar un Customer, así que un Customer recién creado puede no
 * aparecer todavía en la búsqueda inmediatamente después.
 */
export class StripeMetadataOrganizationBillingRepository implements IOrganizationBillingRepository {
  private readonly stripe: Stripe

  constructor(secretKey: string) {
    this.stripe = new Stripe(secretKey)
  }

  async getStripeCustomerId(organizationId: string): Promise<string | null> {
    const escaped = organizationId.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    // Mientras no haya persistencia real, cada request sin Customer conocido
    // podía acumular un duplicado más — si tras una limpieza manual en Stripe
    // el límite se queda corto, subir este número (máximo 100, límite de la
    // Search API) hasta cubrir todos los duplicados restantes.
    const result = await this.stripe.customers.search({
      query: `metadata['organizationId']:'${escaped}'`,
      limit: 10,
    })
    if (result.data.length === 0) return null
    if (result.data.length === 1) return result.data[0].id

    return this.pickCustomerWithSubscriptions(result.data.map((c) => c.id))
  }

  /** Entre varios Customers candidatos, el primero con alguna suscripción propia. */
  private async pickCustomerWithSubscriptions(customerIds: string[]): Promise<string> {
    for (const customerId of customerIds) {
      const subscriptions = await this.stripe.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 1,
      })
      if (subscriptions.data.length > 0) return customerId
    }
    return customerIds[0]
  }

  async setStripeCustomerId(_organizationId: string, _stripeCustomerId: string): Promise<void> {
    // No-op: la metadata del Customer ya fija el enlace, no hay dónde persistirlo aparte.
  }
}
