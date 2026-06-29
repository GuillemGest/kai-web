import { useEffect, useMemo, useState } from 'react'
import { supportUseCases } from '../../../modules/support/application/factory'
import type { SupportArticle } from '../../../modules/support/domain/SupportArticle'
import './SupportPage.css'

export function SupportPage() {
  const [articles, setArticles] = useState<SupportArticle[]>([])

  useEffect(() => {
    supportUseCases.getSupportArticles.execute().then(setArticles)
  }, [])

  const byCategory = useMemo(() => {
    return articles.reduce<Record<string, SupportArticle[]>>((acc, article) => {
      ;(acc[article.category] ??= []).push(article)
      return acc
    }, {})
  }, [articles])

  return (
    <div className="page">
      <h1 className="page__title">Soporte</h1>
      <p className="page__lead">Encuentra respuestas a las preguntas más habituales sobre KAI.</p>

      {Object.entries(byCategory).map(([category, items]) => (
        <section key={category} className="page__section">
          <h2 className="section-title">{category}</h2>
          <div className="support-list">
            {items.map((article) => (
              <article key={article.id} className="support-item">
                <h3 className="support-item__title">{article.title}</h3>
                <p className="support-item__body">{article.body}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
