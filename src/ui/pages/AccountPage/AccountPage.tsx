import { useEffect, useState } from 'react'
import { authUseCases } from '../../../modules/auth/application/factory'
import type { User } from '../../../modules/auth/domain/User'
import { billingUseCases } from '../../../modules/billing/application/factory'
import type { Subscription } from '../../../modules/billing/domain/Subscription'
import { Button } from '../../components/Button/Button'
import './AccountPage.css'

const STATUS_LABEL: Record<Subscription['status'], string> = {
  active: 'Activa',
  canceled: 'Cancelada',
  past_due: 'Pago pendiente',
  none: 'Sin suscripción',
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [subscription, setSubscription] = useState<Subscription | null>(null)

  useEffect(() => {
    authUseCases.getCurrentUser.execute().then((currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        billingUseCases.getCurrentSubscription.execute(currentUser.id).then(setSubscription)
      }
    })
  }, [])

  if (!user) {
    return (
      <div className="page">
        <h1 className="page__title">Mi cuenta</h1>
        <p className="page__lead">No has iniciado sesión.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page__title">Mi cuenta</h1>

      <section className="page__section">
        <h2 className="section-title">Perfil</h2>
        <div className="account-card">
          <div className="account-row">
            <span className="account-row__label">Nombre</span>
            <span>{user.name}</span>
          </div>
          <div className="account-row">
            <span className="account-row__label">Email</span>
            <span>{user.email}</span>
          </div>
        </div>
      </section>

      <section className="page__section">
        <h2 className="section-title">Suscripción</h2>
        <div className="account-card">
          {subscription ? (
            <>
              <div className="account-row">
                <span className="account-row__label">Estado</span>
                <span className={subscription.isActive ? 'status status--active' : 'status'}>
                  {STATUS_LABEL[subscription.status]}
                </span>
              </div>
              <div className="account-row">
                <span className="account-row__label">Plan</span>
                <span>{subscription.planId}</span>
              </div>
              <div className="account-row">
                <span className="account-row__label">Renueva el</span>
                <span>{formatDate(subscription.currentPeriodEnd)}</span>
              </div>
            </>
          ) : (
            <p className="page__lead">No tienes ninguna suscripción activa.</p>
          )}
        </div>
        <div className="account-actions">
          <Button variant="secondary">Gestionar pago</Button>
        </div>
      </section>
    </div>
  )
}
