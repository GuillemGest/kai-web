import type { SupportArticle } from './SupportArticle'

export interface ISupportRepository {
  getArticles(): Promise<SupportArticle[]>
}
