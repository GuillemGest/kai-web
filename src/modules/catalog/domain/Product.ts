export interface ProductPrimitive {
  id: string
  slug: string
  name: string
  description: string
}

export class Product {
  constructor(
    readonly id: string,
    readonly slug: string,
    readonly name: string,
    readonly description: string,
  ) {}

  static fromPrimitive(data: ProductPrimitive): Product {
    return new Product(data.id, data.slug, data.name, data.description)
  }

  toPrimitive(): ProductPrimitive {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      description: this.description,
    }
  }
}
