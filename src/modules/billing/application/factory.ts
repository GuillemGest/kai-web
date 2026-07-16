import { HttpInvoiceRepository } from '../infrastructure/HttpInvoiceRepository'
import { HttpSubscriptionRepository } from '../infrastructure/HttpSubscriptionRepository'
import { InMemoryPaymentMethodRepository } from '../infrastructure/InMemoryPaymentMethodRepository'
import { InMemoryPlanRepository } from '../infrastructure/InMemoryPlanRepository'
import { GetSubscriptions } from './GetSubscriptions'
import { CancelSubscription } from './CancelSubscription'
import { ReactivateSubscription } from './ReactivateSubscription'
import { ChangeSubscriptionPlan } from './ChangeSubscriptionPlan'
import { GetInvoices } from './GetInvoices'
import { GetPaymentMethod } from './GetPaymentMethod'
import { GetPlans } from './GetPlans'

const planRepository = new InMemoryPlanRepository()
// Suscripción y facturas reales: los repos HTTP delegan en /api/subscriptions y
// /api/invoices, que hablan con Stripe en el servidor. La gestión de la
// suscripción (cancelar/reactivar/cambiar plan) usa el MISMO repo HTTP, que
// llama a los endpoints /api/subscriptions/* correspondientes.
const subscriptionRepository = new HttpSubscriptionRepository()
const invoiceRepository = new HttpInvoiceRepository()
const paymentMethodRepository = new InMemoryPaymentMethodRepository()

export const billingUseCases = {
  getPlans: new GetPlans(planRepository),
  getSubscriptions: new GetSubscriptions(subscriptionRepository),
  cancelSubscription: new CancelSubscription(subscriptionRepository),
  reactivateSubscription: new ReactivateSubscription(subscriptionRepository),
  changeSubscriptionPlan: new ChangeSubscriptionPlan(subscriptionRepository, planRepository),
  getInvoices: new GetInvoices(invoiceRepository),
  getPaymentMethod: new GetPaymentMethod(paymentMethodRepository),
}
