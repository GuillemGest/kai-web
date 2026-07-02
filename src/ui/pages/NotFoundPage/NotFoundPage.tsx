import { Link } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import { useLocale } from '../../../i18n/LocaleContext'
import { NOT_FOUND_PAGE_CONTENT } from './content'
import './NotFoundPage.css'

export function NotFoundPage() {
  const { locale } = useLocale()
  const { code, title, lead, ctaLabel, ctaHref } = NOT_FOUND_PAGE_CONTENT[locale]

  return (
    <div className="notfound">
      <p className="notfound__code">{code}</p>
      <h1 className="notfound__title">{title}</h1>
      <p className="page__lead">{lead}</p>
      <Link to={ctaHref} className="notfound__cta">
        <Button variant="primary" size="large">
          {ctaLabel}
        </Button>
      </Link>
    </div>
  )
}
