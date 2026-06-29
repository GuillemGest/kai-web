export interface SupportArticlePrimitive {
  id: string
  slug: string
  title: string
  body: string
  category: string
}

export class SupportArticle {
  constructor(
    readonly id: string,
    readonly slug: string,
    readonly title: string,
    readonly body: string,
    readonly category: string,
  ) {}

  static fromPrimitive(data: SupportArticlePrimitive): SupportArticle {
    return new SupportArticle(data.id, data.slug, data.title, data.body, data.category)
  }

  toPrimitive(): SupportArticlePrimitive {
    return {
      id: this.id,
      slug: this.slug,
      title: this.title,
      body: this.body,
      category: this.category,
    }
  }
}
