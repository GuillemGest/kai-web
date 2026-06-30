export interface ResourcePrimitive {
  id: string
  slug: string
  title: string
  body: string
  category: string
}

export class Resource {
  constructor(
    readonly id: string,
    readonly slug: string,
    readonly title: string,
    readonly body: string,
    readonly category: string,
  ) {}

  static fromPrimitive(data: ResourcePrimitive): Resource {
    return new Resource(data.id, data.slug, data.title, data.body, data.category)
  }

  toPrimitive(): ResourcePrimitive {
    return {
      id: this.id,
      slug: this.slug,
      title: this.title,
      body: this.body,
      category: this.category,
    }
  }
}
