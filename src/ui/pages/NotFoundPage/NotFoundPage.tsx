import { Link } from 'react-router-dom'
import { Button } from '../../components/Button/Button'
import './NotFoundPage.css'

export function NotFoundPage() {
  return (
    <div className="notfound">
      <p className="notfound__code">404</p>
      <h1 className="notfound__title">Página no encontrada</h1>
      <p className="page__lead">La página que buscas no existe o se ha movido.</p>
      <Link to="/" className="notfound__cta">
        <Button variant="primary" size="large">
          Volver al inicio
        </Button>
      </Link>
    </div>
  )
}
