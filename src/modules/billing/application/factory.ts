import { InMemoryPlanRepository } from '../infrastructure/InMemoryPlanRepository'
import { InMemorySubscriptionRepository } from '../infrastructure/InMemorySubscriptionRepository'
import { GetCurrentSubscription } from './GetCurrentSubscription'
import { GetPlans } from './GetPlans'

const planRepository = new InMemoryPlanRepository()
const subscriptionRepository = new InMemorySubscriptionRepository()

export const billingUseCases = {
  getPlans: new GetPlans(planRepository),
  getCurrentSubscription: new GetCurrentSubscription(subscriptionRepository),
}
