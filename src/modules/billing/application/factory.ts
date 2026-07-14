import { HttpInvoiceRepository } from '../infrastructure/HttpInvoiceRepository'
import { HttpSubscriptionRepository } from '../infrastructure/HttpSubscriptionRepository'
import { InMemoryPaymentMethodRepository } from '../infrastructure/InMemoryPaymentMethodRepository'
import { InMemoryPlanRepository } from '../infrastructure/InMemoryPlanRepository'
import { GetSubscriptions } from './GetSubscriptions'
import { GetInvoices } from './GetInvoices'
import { GetPaymentMethod } from './GetPaymentMethod'
import { GetPlans } from './GetPlans'

const planRepository = new InMemoryPlanRepository()
// Suscripción y facturas reales: los repos HTTP delegan en /api/subscription y
// /api/invoices, que hablan con Stripe en el servidor.
const subscriptionRepository = new HttpSubscriptionRepository()
const invoiceRepository = new HttpInvoiceRepository()
const paymentMethodRepository = new InMemoryPaymentMethodRepository()

export const billingUseCases = {
  getPlans: new GetPlans(planRepository),
  getSubscriptions: new GetSubscriptions(subscriptionRepository),
  getInvoices: new GetInvoices(invoiceRepository),
  getPaymentMethod: new GetPaymentMethod(paymentMethodRepository),
}
