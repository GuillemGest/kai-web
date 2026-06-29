import type { IProductRepository } from '../domain/IProductRepository'
import type { Product } from '../domain/Product'

export class GetProduct {
  constructor(private readonly repository: IProductRepository) {}

  execute(slug: string): Promise<Product | null> {
    return this.repository.getBySlug(slug)
  }
}
