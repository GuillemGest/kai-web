import { InMemoryProductRepository } from '../infrastructure/InMemoryProductRepository'
import { GetProduct } from './GetProduct'

const productRepository = new InMemoryProductRepository()

export const catalogUseCases = {
  getProduct: new GetProduct(productRepository),
}
