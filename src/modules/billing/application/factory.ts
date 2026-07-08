import { InMemoryInvoiceRepository } from '../infrastructure/InMemoryInvoiceRepository'
import { InMemoryPaymentMethodRepository } from '../infrastructure/InMemoryPaymentMethodRepository'
import { InMemoryPlanRepository } from '../infrastructure/InMemoryPlanRepository'
import { InMemorySubscriptionRepository } from '../infrastructure/InMemorySubscriptionRepository'
import { GetCurrentSubscription } from './GetCurrentSubscription'
import { GetInvoices } from './GetInvoices'
import { GetPaymentMethod } from './GetPaymentMethod'
import { GetPlans } from './GetPlans'

const planRepository = new InMemoryPlanRepository()
const subscriptionRepository = new InMemorySubscriptionRepository()
const invoiceRepository = new InMemoryInvoiceRepository()
const paymentMethodRepository = new InMemoryPaymentMethodRepository()

export const billingUseCases = {
  getPlans: new GetPlans(planRepository),
  getCurrentSubscription: new GetCurrentSubscription(subscriptionRepository),
  getInvoices: new GetInvoices(invoiceRepository),
  getPaymentMethod: new GetPaymentMethod(paymentMethodRepository),
}
