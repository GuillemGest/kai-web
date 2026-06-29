import type { ISupportRepository } from '../domain/ISupportRepository'
import type { SupportArticle } from '../domain/SupportArticle'

export class GetSupportArticles {
  constructor(private readonly repository: ISupportRepository) {}

  execute(): Promise<SupportArticle[]> {
    return this.repository.getArticles()
  }
}
