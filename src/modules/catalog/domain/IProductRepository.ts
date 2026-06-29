import type { Product } from './Product'

export interface IProductRepository {
  getBySlug(slug: string): Promise<Product | null>
}
