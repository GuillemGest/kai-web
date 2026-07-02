import { useEffect, useState } from 'react'
import { authUseCases } from '../../../modules/auth/application/factory'
import type { User } from '../../../modules/auth/domain/User'
import { billingUseCases } from '../../../modules/billing/application/factory'
import type { Subscription } from '../../../modules/billing/domain/Subscription'
import { Button } from '../../components/Button/Button'
import { useLocale } from '../../../i18n/LocaleContext'
import { ACCOUNT_PAGE_CONTENT } from './content'
import './AccountPage.css'

function formatDate(iso: string, localeTag: string): string {
  return new Date(iso).toLocaleDateString(localeTag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function AccountPage() {
  const { locale } = useLocale()
  const { locale: localeTag, title, notLoggedIn, profile, subscription: subCopy } =
    ACCOUNT_PAGE_CONTENT[locale]
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
        <h1 className="page__title">{title}</h1>
        <p className="page__lead">{notLoggedIn}</p>
      </div>
    )
  }

  return (
    <div className="page">
      <h1 className="page__title">{title}</h1>

      <section className="page__section">
        <h2 className="section-title">{profile.title}</h2>
        <div className="account-card">
          <div className="account-row">
            <span className="account-row__label">{profile.nameLabel}</span>
            <span>{user.name}</span>
          </div>
          <div className="account-row">
            <span className="account-row__label">{profile.emailLabel}</span>
            <span>{user.email}</span>
          </div>
        </div>
      </section>

      <section className="page__section">
        <h2 className="section-title">{subCopy.title}</h2>
        <div className="account-card">
          {subscription ? (
            <>
              <div className="account-row">
                <span className="account-row__label">{subCopy.statusLabel}</span>
                <span className={subscription.isActive ? 'status status--active' : 'status'}>
                  {subCopy.statusLabels[subscription.status]}
                </span>
              </div>
              <div className="account-row">
                <span className="account-row__label">{subCopy.planLabel}</span>
                <span>{subscription.planId}</span>
              </div>
              <div className="account-row">
                <span className="account-row__label">{subCopy.renewsAtLabel}</span>
                <span>{formatDate(subscription.currentPeriodEnd, localeTag)}</span>
              </div>
            </>
          ) : (
            <p className="page__lead">{subCopy.empty}</p>
          )}
        </div>
        <div className="account-actions">
          <Button variant="secondary">{subCopy.manageButton}</Button>
        </div>
      </section>
    </div>
  )
}
