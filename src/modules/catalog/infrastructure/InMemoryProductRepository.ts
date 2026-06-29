import type { IProductRepository } from '../domain/IProductRepository'
import { Product, type ProductPrimitive } from '../domain/Product'

const PRODUCTS: ProductPrimitive[] = [
  {
    id: 'kai',
    slug: 'kai',
    name: 'KAI',
    description:
      'El asistente de IA que encuentra, organiza y exporta los momentos clave de tus vídeos. Funciona como plugin en tu flujo de trabajo.',
  },
]

export class InMemoryProductRepository implements IProductRepository {
  async getBySlug(slug: string): Promise<Product | null> {
    const found = PRODUCTS.find((p) => p.slug === slug)
    return found ? Product.fromPrimitive(found) : null
  }
}
