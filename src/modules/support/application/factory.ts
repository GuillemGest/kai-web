import { InMemorySupportRepository } from '../infrastructure/InMemorySupportRepository'
import { GetSupportArticles } from './GetSupportArticles'

const supportRepository = new InMemorySupportRepository()

export const supportUseCases = {
  getSupportArticles: new GetSupportArticles(supportRepository),
}
