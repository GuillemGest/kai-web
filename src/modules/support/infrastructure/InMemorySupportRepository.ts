import type { ISupportRepository } from '../domain/ISupportRepository'
import { SupportArticle, type SupportArticlePrimitive } from '../domain/SupportArticle'

const ARTICLES: SupportArticlePrimitive[] = [
  {
    id: 'install',
    slug: 'instalar-kai',
    title: '¿Cómo instalo KAI?',
    body: 'Descarga el instalador para tu sistema operativo desde la página de descargas y sigue los pasos del asistente.',
    category: 'Primeros pasos',
  },
  {
    id: 'activate',
    slug: 'activar-suscripcion',
    title: 'Activar mi suscripción',
    body: 'Inicia sesión en KAI con la cuenta con la que contrataste el plan. La suscripción se valida automáticamente.',
    category: 'Cuenta y planes',
  },
  {
    id: 'billing',
    slug: 'gestionar-pago',
    title: 'Gestionar método de pago',
    body: 'Desde tu página de cuenta puedes actualizar el método de pago y consultar tus facturas.',
    category: 'Cuenta y planes',
  },
  {
    id: 'export',
    slug: 'exportar-clips',
    title: 'Exportar mis clips',
    body: 'Usa el botón Exportar del editor para generar el archivo final con los momentos seleccionados.',
    category: 'Uso del plugin',
  },
]

export class InMemorySupportRepository implements ISupportRepository {
  async getArticles(): Promise<SupportArticle[]> {
    return ARTICLES.map(SupportArticle.fromPrimitive)
  }
}
