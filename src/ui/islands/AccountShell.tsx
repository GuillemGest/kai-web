import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ChevronRight,
  CreditCard,
  Download,
  Laptop,
  LogOut,
  Monitor,
  PartyPopper,
  Shield,
  Smartphone,
  User as UserIcon,
  Users,
  X,
} from 'lucide-react'
import { authUseCases } from '../../modules/auth/application/factory'
import type { User } from '../../modules/auth/domain/User'
import type { DeviceSession } from '../../modules/auth/domain/DeviceSession'
import { billingUseCases } from '../../modules/billing/application/factory'
import type { Subscription } from '../../modules/billing/domain/Subscription'
import type { Plan, BillingPeriod } from '../../modules/billing/domain/Plan'
import { planChangeTiming } from '../../modules/billing/domain/Plan'
import type { Invoice } from '../../modules/billing/domain/Invoice'
import type { PaymentMethod } from '../../modules/billing/domain/PaymentMethod'
import { adminUseCases } from '../../modules/admin/application/factory'
import type { ManagedUser } from '../../modules/admin/domain/ManagedUser'
import { organizationIdsOf, usersInOrganization } from '../../modules/admin/domain/managedUsers'
import { Button } from '../components/Button/Button'
import { Modal } from '../components/Modal/Modal'
import { startCardSetup } from '../utils/startCardSetup'
import { initials } from '../utils/initials'
import { getLocaleUrl } from '../../i18n/getLocaleUrl'
import type { Locale } from '../../i18n/locales'
import { LOCALE_LABELS } from '../../i18n/locales'
import { ACCOUNT_PAGE_CONTENT } from '../pages/AccountPage/content'
import { PLAN_TRANSLATIONS, type PlanId } from '../pages/ShopPage/content'
import '../pages/AccountPage/AccountPage.css'

type Content = (typeof ACCOUNT_PAGE_CONTENT)[Locale]
type SectionId = 'account' | 'billing' | 'team' | 'security'

interface AccountShellProps {
  locale: Locale
}

// --- Formateadores ---------------------------------------------------------
function formatDate(iso: string, localeTag: string): string {
  return new Date(iso).toLocaleDateString(localeTag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatDateTime(iso: string, localeTag: string): string {
  return new Date(iso).toLocaleString(localeTag, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Importe en céntimos → moneda del locale (como Stripe: unidad menor). */
function formatAmount(cents: number, currency: string, localeTag: string): string {
  return new Intl.NumberFormat(localeTag, { style: 'currency', currency }).format(cents / 100)
}

/** Rellena plantillas tipo "Descargar factura {number}". */
function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? `{${key}}`)
}

// Todas las secciones son visibles para cualquier usuario con sesión; el rol
// admin ya no recorta el menú (solo condiciona datos internos como el listado
// de usuarios, que el backend devuelve vacío a los no-admin).
const SECTIONS: readonly SectionId[] = ['account', 'billing', 'team', 'security']

/** Sección inicial a partir del hash de la URL (deep-link), con fallback a 'account'. */
function sectionFromHash(): SectionId {
  if (typeof window === 'undefined') return 'account'
  const hash = window.location.hash.replace('#', '') as SectionId
  return SECTIONS.includes(hash) ? hash : 'account'
}

/** ¿Se llegó a la cuenta desde la prueba gratis (?trial=started)? Solo apariencia. */
function trialStartedFromQuery(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('trial') === 'started'
}

// ===========================================================================
export function AccountShell({ locale }: AccountShellProps) {
  const content: Content = ACCOUNT_PAGE_CONTENT[locale]
  const localeTag = content.locale

  const [section, setSection] = useState<SectionId>(sectionFromHash)
  const [showTrialBanner, setShowTrialBanner] = useState(trialStartedFromQuery)
  const [user, setUser] = useState<User | null>(null)
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [managedUsers, setManagedUsers] = useState<ManagedUser[]>([])
  const [selectedOrg, setSelectedOrg] = useState<string | null>(null)
  const [sessions, setSessions] = useState<DeviceSession[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let active = true
    authUseCases.getCurrentUser.execute().then(async (currentUser) => {
      if (!active) return
      setUser(currentUser)
      if (!currentUser) {
        setLoaded(true)
        return
      }
      // El listado de usuarios requiere el JWT de la sesión (endpoint admin).
      const session = authUseCases.getCurrentSessionSync.execute()
      const [sub, allPlans, pms, invs, users, sess] = await Promise.all([
        // Suscripciones reales de Stripe por email (identidad de facturación);
        // puede haber varias a la vez (un plan por producción, por ejemplo).
        billingUseCases.getSubscriptions.execute(currentUser.email).catch(() => []),
        // Catálogo de planes: alimenta el diálogo de cambio de plan.
        billingUseCases.getPlans.execute().catch(() => []),
        // Tarjetas reales de Stripe por email; puede haber varias, una marcada
        // como predeterminada (la que cobra la renovación).
        billingUseCases.getPaymentMethods.execute(currentUser.email).catch(() => []),
        // Facturas reales de Stripe: la identidad de facturación es el email
        // (el checkout crea el Customer por email). Si falla, historial vacío.
        billingUseCases.getInvoices.execute(currentUser.email).catch(() => []),
        session
          ? adminUseCases.getManagedUsers.execute(session.token).catch(() => [])
          : Promise.resolve([]),
        authUseCases.getActiveSessions.execute(currentUser.id),
      ])
      if (!active) return
      setSubscriptions(sub)
      setPlans(allPlans)
      setPaymentMethods(pms)
      setInvoices(invs)
      setManagedUsers(users)
      // Preselecciona la primera organización disponible.
      setSelectedOrg(organizationIdsOf(users)[0] ?? null)
      setSessions(sess)
      setLoaded(true)
    })
    return () => {
      active = false
    }
  }, [])

  // Deep-link: refleja el hash cuando el usuario navega con atrás/adelante.
  useEffect(() => {
    const onHashChange = () => setSection(sectionFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const goTo = (id: SectionId) => {
    setSection(id)
    if (window.location.hash.replace('#', '') !== id) {
      window.history.pushState(null, '', `#${id}`)
    }
  }

  // Tras cancelar/reactivar/cambiar de plan se recargan las suscripciones para
  // reflejar el nuevo estado (baja programada, plan pendiente…) sin recargar
  // toda la página.
  const refreshSubscriptions = async () => {
    if (!user) return
    const fresh = await billingUseCases.getSubscriptions.execute(user.email).catch(() => null)
    if (fresh) setSubscriptions(fresh)
  }

  // Tras marcar una tarjeta como predeterminada se recarga la lista para
  // reflejar el nuevo `isDefault` sin recargar toda la página.
  const refreshPaymentMethods = async () => {
    if (!user) return
    const fresh = await billingUseCases.getPaymentMethods.execute(user.email).catch(() => null)
    if (fresh) setPaymentMethods(fresh)
  }

  // El pago de un upgrade se confirma en una pestaña nueva (Stripe), no en
  // esta: al volver el foco a esta pestaña (el usuario cierra o cambia de
  // vuelta), se refresca el estado real — activo si pagó, `past_due` si no.
  useEffect(() => {
    if (!user) return
    const onVisible = () => {
      if (document.visibilityState === 'visible') refreshSubscriptions()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const dismissTrialBanner = () => {
    setShowTrialBanner(false)
    // Limpiamos ?trial=started de la URL para que no reaparezca al recargar.
    const url = new URL(window.location.href)
    url.searchParams.delete('trial')
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`)
  }

  const handleLogout = async () => {
    const result = await authUseCases.logout.execute()
    if (result.kind === 'switched') {
      // Había otra cuenta guardada: se activó automáticamente. Recargamos
      // /cuenta para que las islas vean la nueva sesión.
      window.location.href = getLocaleUrl('/cuenta', locale)
      return
    }
    // Sin cuentas guardadas: volvemos a la home (header mostrará "Iniciar sesión").
    window.location.href = getLocaleUrl('/', locale)
  }

  const activeSection: SectionId = section

  const nav = useMemo(
    () =>
      [
        { id: 'account', label: content.nav.account, Icon: UserIcon },
        { id: 'billing', label: content.nav.billing, Icon: CreditCard },
        { id: 'team', label: content.nav.team, Icon: Users },
        { id: 'security', label: content.nav.security, Icon: Shield },
      ] as const,
    [content],
  )

  if (loaded && !user) {
    return (
      <div className="account-guard">
        <h1 className="account-guard__title">{content.title}</h1>
        <p className="account-guard__lead">{content.notLoggedIn}</p>
      </div>
    )
  }

  return (
    <div className="account">
      <header className="account__head">
        <div className="account__head-text">
          <h1 className="account__title">{content.title}</h1>
          <p className="account__subtitle">{content.subtitle}</p>
        </div>
        <Button variant="ghost" className="account__logout" onClick={handleLogout}>
          <LogOut size={18} strokeWidth={2} aria-hidden />
          {content.logoutButton}
        </Button>
      </header>

      {showTrialBanner && (
        <div className="account-trial" role="status">
          <span className="account-trial__icon" aria-hidden>
            <PartyPopper size={20} strokeWidth={2} />
          </span>
          <div className="account-trial__body">
            <p className="account-trial__title">{content.trialBanner.title}</p>
            <p className="account-trial__text">{content.trialBanner.text}</p>
          </div>
          <button
            type="button"
            className="account-trial__close"
            onClick={dismissTrialBanner}
            aria-label={content.trialBanner.dismissLabel}
          >
            <X size={18} strokeWidth={2} aria-hidden />
          </button>
        </div>
      )}

      <nav className="account__nav" aria-label={content.title}>
        {nav.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className="account-tab"
            aria-current={activeSection === id ? 'page' : undefined}
            onClick={() => goTo(id)}
          >
            <Icon className="account-tab__icon" size={18} strokeWidth={2} aria-hidden />
            {label}
          </button>
        ))}
      </nav>

      <div className="account__panel">
        {activeSection === 'account' && (
          <AccountSection content={content} user={user} localeTag={localeTag} locale={locale} />
        )}
        {activeSection === 'billing' && user && (
          <BillingSection
            content={content}
            locale={locale}
            localeTag={localeTag}
            email={user.email}
            subscriptions={subscriptions}
            plans={plans}
            paymentMethods={paymentMethods}
            invoices={invoices}
            onSubscriptionsChanged={refreshSubscriptions}
            onPaymentMethodsChanged={refreshPaymentMethods}
          />
        )}
        {activeSection === 'team' && (
          <TeamSection
            content={content}
            users={managedUsers}
            selectedOrg={selectedOrg}
            onSelectOrg={setSelectedOrg}
          />
        )}
        {activeSection === 'security' && (
          <SecuritySection content={content} sessions={sessions} localeTag={localeTag} />
        )}
      </div>
    </div>
  )
}

// --- Sección: Información de la cuenta --------------------------------------
function AccountSection({
  content,
  user,
  localeTag,
  locale,
}: {
  content: Content
  user: User | null
  localeTag: string
  locale: Locale
}) {
  const c = content.account
  return (
    <section className="account-view" aria-label={c.title}>
      <div className="account-view__head">
        <div>
          <h2 className="account-view__title">{c.title}</h2>
          <p className="account-view__desc">{c.description}</p>
        </div>
      </div>

      <div className="account-panel">
        <div className="account-row">
          <span className="account-row__label">{c.nameLabel}</span>
          <span className="account-row__value">{user?.name}</span>
        </div>
        <div className="account-row">
          <span className="account-row__label">{c.emailLabel}</span>
          <span className="account-row__value">{user?.email}</span>
        </div>
        <div className="account-row">
          <span className="account-row__label">{c.memberSinceLabel}</span>
          <span className="account-row__value">
            {user ? formatDate(user.createdAt, localeTag) : '—'}
          </span>
        </div>
        <div className="account-row">
          <span className="account-row__label">{c.languageLabel}</span>
          <span className="account-row__value">{LOCALE_LABELS[locale].long}</span>
        </div>
      </div>

      <div className="account-actions">
        <Button variant="ghost">{c.changePasswordButton}</Button>
        <Button variant="secondary">{c.editButton}</Button>
      </div>
    </section>
  )
}

// --- Sección: Facturación --------------------------------------------------
// Un único punto de entrada ("Administrar suscripción") por suscripción; el
// modal resultante navega internamente entre hub / cancelar / reactivar /
// cambiar de plan, en vez de abrir varios modales sueltos.
type PlanDialog = { subscription: Subscription } | null

function BillingSection({
  content,
  locale,
  localeTag,
  email,
  subscriptions,
  plans,
  paymentMethods,
  invoices,
  onSubscriptionsChanged,
  onPaymentMethodsChanged,
}: {
  content: Content
  locale: Locale
  localeTag: string
  email: string
  subscriptions: Subscription[]
  plans: Plan[]
  paymentMethods: PaymentMethod[]
  invoices: Invoice[]
  onSubscriptionsChanged: () => Promise<void>
  onPaymentMethodsChanged: () => Promise<void>
}) {
  const c = content.billing
  const [dialog, setDialog] = useState<PlanDialog>(null)
  // Id de la tarjeta que se está marcando como predeterminada ahora mismo
  // (deshabilita su botón mientras dura la llamada) y, si falla, qué tarjeta.
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null)
  const [setDefaultError, setSetDefaultError] = useState(false)

  const handleSetDefault = async (paymentMethodId: string) => {
    setSettingDefaultId(paymentMethodId)
    setSetDefaultError(false)
    try {
      await billingUseCases.setDefaultPaymentMethod.execute(email, paymentMethodId)
      await onPaymentMethodsChanged()
    } catch {
      setSetDefaultError(true)
    } finally {
      setSettingDefaultId(null)
    }
  }

  const [addingCard, setAddingCard] = useState(false)
  // Mensaje real del servidor (no un booleano genérico): startCardSetup ya
  // propaga el `error` del endpoint, y necesitamos verlo para diagnosticar
  // fallos de Stripe en vez de mostrar siempre el mismo texto genérico.
  const [addCardError, setAddCardError] = useState<string | null>(null)

  const handleAddCard = async () => {
    setAddingCard(true)
    setAddCardError(null)
    try {
      // Página de Stripe (Checkout en modo `setup`) en pestaña NUEVA — mismo
      // patrón que el pago de un upgrade: no se pierde el panel de cuenta. Al
      // volver, el listener de focus/visibility ya existente refresca la lista.
      const url = await startCardSetup({ email, locale })
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (error) {
      setAddCardError(error instanceof Error ? error.message : c.plan.genericError)
    } finally {
      setAddingCard(false)
    }
  }

  const planNameOf = (planId: string): string =>
    PLAN_TRANSLATIONS[locale][planId as PlanId]?.name ?? planId

  return (
    <section className="account-view" aria-label={c.title}>
      <div className="account-view__head">
        <div>
          <h2 className="account-view__title">{c.title}</h2>
          <p className="account-view__desc">{c.description}</p>
        </div>
      </div>

      {/* Planes actuales: el usuario puede tener varias suscripciones a la vez
          (p. ej. un plan por producción), así que se listan todas. Las que ya
          están canceladas DEL TODO (status 'canceled': la baja ya se hizo
          efectiva) se excluyen — no son un plan "actual". La baja programada
          pero aún no efectiva sigue en estado 'active' (isEnding) y sí se
          muestra, porque el usuario todavía tiene el plan hasta esa fecha. */}
      <div className="account-panel">
        <p className="account-panel__title">{c.plan.title}</p>
        {(() => {
          const currentSubscriptions = subscriptions.filter((s) => s.status !== 'canceled')
          if (currentSubscriptions.length === 0) {
            return <p className="account-empty">{c.plan.empty}</p>
          }
          return currentSubscriptions.map((subscription) => {
            const planName = planNameOf(subscription.planId)
            const statusTone =
              subscription.status === 'active'
                ? subscription.cancelAtPeriodEnd
                  ? 'status-chip--warning'
                  : 'status-chip--active'
                : 'status-chip--warning' // past_due: único status distinto de 'active' que llega aquí.
            // Metadato principal: baja programada, cambio pendiente, o renovación.
            const meta = subscription.isEnding
              ? `${c.plan.endsAtLabel} ${formatDate(subscription.currentPeriodEnd, localeTag)}`
              : `${c.plan.renewsAtLabel} ${formatDate(subscription.currentPeriodEnd, localeTag)}`
            return (
              <div className="plan-summary" key={subscription.id}>
                <div>
                  <p className="plan-summary__name">{planName}</p>
                  <p className="plan-summary__meta">{meta}</p>
                  {subscription.pendingPlanId && (
                    <p className="plan-summary__pending">
                      {fill(c.plan.pendingChangeLabel, {
                        plan: planNameOf(subscription.pendingPlanId),
                        date: formatDate(subscription.currentPeriodEnd, localeTag),
                      })}
                    </p>
                  )}
                </div>
                <div className="plan-summary__aside">
                  <span className={`status-chip ${statusTone}`}>
                    {c.plan.statusLabels[subscription.status]}
                  </span>
                  {subscription.isManageable && (
                    <div className="plan-summary__actions">
                      <Button variant="secondary" onClick={() => setDialog({ subscription })}>
                        {c.plan.manageButton}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        })()}
      </div>

      {dialog && (
        <ManageSubscriptionDialog
          content={content}
          locale={locale}
          localeTag={localeTag}
          email={email}
          subscription={dialog.subscription}
          plans={plans}
          planName={planNameOf(dialog.subscription.planId)}
          onClose={() => setDialog(null)}
          onDone={onSubscriptionsChanged}
        />
      )}

      {/* Método de pago: todas las tarjetas guardadas en Stripe para esta
          cuenta. La marcada "Predeterminada" es la que cobra la renovación de
          CUALQUIER suscripción del Customer — no hay una tarjeta por plan. */}
      <div className="account-panel">
        <div className="account-panel__head">
          <p className="account-panel__title account-panel__title--flush">
            {c.paymentMethod.title}
          </p>
          <Button variant="ghost" size="small" disabled={addingCard} onClick={handleAddCard}>
            {addingCard ? c.paymentMethod.addingCardButton : c.paymentMethod.addCardButton}
          </Button>
        </div>
        <p className="account-panel__hint">{c.paymentMethod.hint}</p>
        {addCardError && (
          <p className="modal-error account-panel__inline-error">{addCardError}</p>
        )}
        {paymentMethods.length > 0 ? (
          paymentMethods.map((pm) => (
            <div className="payment" key={pm.id}>
              <div className="payment__card">
                <span className="payment__brand">{pm.brand}</span>
                <div>
                  <p className="payment__digits">•••• {pm.last4}</p>
                  <p className="payment__exp">
                    {c.paymentMethod.expiresLabel} {pm.expLabel}
                  </p>
                </div>
              </div>
              {pm.isDefault ? (
                <span className="status-chip status-chip--active">
                  {c.paymentMethod.defaultLabel}
                </span>
              ) : (
                <Button
                  variant="ghost"
                  disabled={settingDefaultId === pm.id}
                  onClick={() => handleSetDefault(pm.id)}
                >
                  {c.paymentMethod.makeDefaultButton}
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="account-empty">{c.paymentMethod.empty}</p>
        )}
        {setDefaultError && <p className="modal-error">{c.plan.genericError}</p>}
      </div>

      {/* Historial de facturas */}
      <div className="account-panel">
        <p className="account-panel__title">{c.invoices.title}</p>
        {invoices.length > 0 ? (
          <div className="invoice-table-wrap scrollbar">
            <table className="invoice-table">
              <thead>
                <tr>
                  <th scope="col">{c.invoices.numberLabel}</th>
                  <th scope="col">{c.invoices.dateLabel}</th>
                  <th scope="col">{c.invoices.statusLabel}</th>
                  <th scope="col" className="is-end">
                    {c.invoices.amountLabel}
                  </th>
                  <th scope="col" className="is-end">
                    <span className="sr-only">{c.invoices.downloadLabel}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id}>
                    <td className="invoice-table__num">{inv.number}</td>
                    <td>{formatDate(inv.issuedAt, localeTag)}</td>
                    <td>
                      <span
                        className={`status-chip ${inv.isPaid ? 'status-chip--active' : 'status-chip--neutral'}`}
                      >
                        {c.invoices.statusLabels[inv.status]}
                      </span>
                    </td>
                    <td className="is-end invoice-table__amount">
                      {formatAmount(inv.amount, inv.currency, localeTag)}
                    </td>
                    <td className="is-end">
                      {/* PDF alojado en Stripe: se abre en pestaña nueva. Sin
                          URL (factura aún sin PDF) no se pinta enlace. */}
                      {inv.pdfUrl && (
                        <a
                          className="invoice-download"
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={fill(c.invoices.downloadAriaLabel, { number: inv.number })}
                        >
                          <Download size={16} strokeWidth={2} aria-hidden />
                          {c.invoices.downloadLabel}
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="account-empty">{c.invoices.empty}</p>
        )}
      </div>
    </section>
  )
}

// --- Diálogos de gestión de la suscripción ---------------------------------
// Estado compartido de una operación asíncrona sobre la suscripción.
function useSubscriptionAction(onDone: () => Promise<void>, onClose: () => void) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(false)

  const run = async (op: () => Promise<void>) => {
    setPending(true)
    setError(false)
    try {
      await op()
      await onDone()
      onClose()
    } catch {
      setError(true)
      setPending(false)
    }
  }

  return { pending, error, run }
}

// Vista interna del modal de administración: hub con las dos acciones, o los
// pasos de cada operación. Cancelar/reactivar y cambiar de plan piden SIEMPRE
// un paso de resumen (con precio/fecha) antes del paso final de confirmación.
type ManageView = 'hub' | 'confirm-review' | 'confirm-final' | 'change-select' | 'change-review'

function ManageSubscriptionDialog({
  content,
  locale,
  localeTag,
  email,
  subscription,
  plans,
  planName,
  onClose,
  onDone,
}: {
  content: Content
  locale: Locale
  localeTag: string
  email: string
  subscription: Subscription
  plans: Plan[]
  planName: string
  onClose: () => void
  onDone: () => Promise<void>
}) {
  const c = content.billing.plan
  const [view, setView] = useState<ManageView>('hub')
  // Plan elegido en el paso de selección; se conserva al avanzar al resumen y
  // al volver atrás desde él (no se pierde la elección).
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const backToHub = () => setView('hub')

  if (view === 'confirm-review' || view === 'confirm-final') {
    return (
      <ConfirmCancelOrReactivateFlow
        content={content}
        localeTag={localeTag}
        email={email}
        subscription={subscription}
        planName={planName}
        step={view === 'confirm-final' ? 'final' : 'review'}
        onAdvance={() => setView('confirm-final')}
        onBack={() => (view === 'confirm-final' ? setView('confirm-review') : backToHub())}
        onClose={onClose}
        onDone={onDone}
      />
    )
  }

  if (view === 'change-select' || view === 'change-review') {
    return (
      <ChangePlanFlow
        content={content}
        locale={locale}
        localeTag={localeTag}
        email={email}
        subscription={subscription}
        plans={plans}
        step={view === 'change-review' ? 'review' : 'select'}
        selectedPlanId={selectedPlanId}
        onSelectPlan={setSelectedPlanId}
        onAdvance={() => setView('change-review')}
        onBack={() => (view === 'change-review' ? setView('change-select') : backToHub())}
        onClose={onClose}
        onDone={onDone}
      />
    )
  }

  // Hub: resumen de la suscripción + dos acciones grandes (cambiar / cancelar
  // o reanudar). Un único punto de entrada en vez de botones sueltos en la lista.
  return (
    <Modal open title={c.manageDialog.title} onClose={onClose} closeLabel={c.changeDialog.cancel}>
      <div className="manage-sub__summary">
        <span className="manage-sub__plan-name">{planName}</span>
        <span className="manage-sub__meta">
          {subscription.isEnding
            ? `${c.endsAtLabel} ${formatDate(subscription.currentPeriodEnd, localeTag)}`
            : `${c.renewsAtLabel} ${formatDate(subscription.currentPeriodEnd, localeTag)}`}
        </span>
      </div>

      <div className="manage-sub__actions">
        {!subscription.isEnding && (
          <button
            type="button"
            className="manage-sub__action"
            onClick={() => setView('change-select')}
          >
            <span className="manage-sub__action-text">
              <span className="manage-sub__action-title">{c.changePlanButton}</span>
              <span className="manage-sub__action-desc">{c.manageDialog.changeDesc}</span>
            </span>
            <ChevronRight size={16} strokeWidth={2} className="manage-sub__action-arrow" aria-hidden />
          </button>
        )}

        <button
          type="button"
          className={`manage-sub__action ${subscription.isEnding ? '' : 'manage-sub__action--destructive'}`}
          onClick={() => setView('confirm-review')}
        >
          <span className="manage-sub__action-text">
            <span className="manage-sub__action-title">
              {subscription.isEnding ? c.reactivateButton : c.cancelButton}
            </span>
            <span className="manage-sub__action-desc">
              {subscription.isEnding ? c.manageDialog.reactivateDesc : c.manageDialog.cancelDesc}
            </span>
          </span>
          <ChevronRight size={16} strokeWidth={2} className="manage-sub__action-arrow" aria-hidden />
        </button>
      </div>
    </Modal>
  )
}

/**
 * Cancelar y reactivar comparten flujo (son la misma confirmación en espejo),
 * con DOS pasos reales: `review` explica el efecto (fecha, qué pasa con el
 * acceso) y `final` pide una confirmación explícita separada antes de
 * ejecutar. Evita que un doble clic accidental dé de baja la suscripción.
 */
function ConfirmCancelOrReactivateFlow({
  content,
  localeTag,
  email,
  subscription,
  planName,
  step,
  onAdvance,
  onBack,
  onClose,
  onDone,
}: {
  content: Content
  localeTag: string
  email: string
  subscription: Subscription
  planName: string
  step: 'review' | 'final'
  onAdvance: () => void
  onBack: () => void
  onClose: () => void
  onDone: () => Promise<void>
}) {
  const isReactivate = subscription.isEnding
  const d = isReactivate ? content.billing.plan.reactivateDialog : content.billing.plan.cancelDialog
  const { pending, error, run } = useSubscriptionAction(onDone, onClose)
  const values = { plan: planName, date: formatDate(subscription.currentPeriodEnd, localeTag) }

  if (step === 'review') {
    return (
      <Modal open title={d.title} onClose={onClose} closeLabel={d.cancel}>
        <button type="button" className="modal-back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden />
          {content.billing.plan.manageDialog.backLabel}
        </button>

        <p>{fill(d.body, values)}</p>

        <div className="modal-inline-actions">
          <Button variant="ghost" onClick={onBack}>
            {d.cancel}
          </Button>
          <Button variant={isReactivate ? 'primary' : 'destructive'} onClick={onAdvance}>
            {content.billing.plan.manageDialog.continueLabel}
          </Button>
        </div>
      </Modal>
    )
  }

  // Paso final: resumen corto + un único botón de confirmación explícita, para
  // que la acción irreversible no dependa de un solo clic desde el hub.
  return (
    <Modal open title={d.title} onClose={onClose} closeLabel={d.cancel}>
      <button type="button" className="modal-back" onClick={onBack} disabled={pending}>
        <ArrowLeft size={16} strokeWidth={2} aria-hidden />
        {content.billing.plan.manageDialog.backLabel}
      </button>

      <div className="confirm-summary">
        <div className="confirm-summary__row">
          <span className="confirm-summary__label">{content.billing.plan.planLabel}</span>
          <span className="confirm-summary__value">{planName}</span>
        </div>
        <div className="confirm-summary__row">
          <span className="confirm-summary__label">
            {isReactivate ? content.billing.plan.renewsAtLabel : content.billing.plan.endsAtLabel}
          </span>
          <span className="confirm-summary__value">
            {formatDate(subscription.currentPeriodEnd, localeTag)}
          </span>
        </div>
      </div>
      <p className="plan-change-note">{d.finalNote}</p>
      {error && <p className="modal-error">{content.billing.plan.genericError}</p>}

      <div className="modal-inline-actions">
        <Button variant="ghost" onClick={onBack} disabled={pending}>
          {d.cancel}
        </Button>
        <Button
          variant={isReactivate ? 'primary' : 'destructive'}
          disabled={pending}
          onClick={() =>
            run(() =>
              isReactivate
                ? billingUseCases.reactivateSubscription.execute(
                    email,
                    subscription.stripeSubscriptionId!,
                  )
                : billingUseCases.cancelSubscription.execute(
                    email,
                    subscription.stripeSubscriptionId!,
                  ),
            )
          }
        >
          {d.confirm}
        </Button>
      </div>
    </Modal>
  )
}

/**
 * Cambio de plan en DOS pasos: `select` elige el plan de destino; `review`
 * muestra el precio del plan nuevo, el tipo de cobro (prorrateo ahora vs. fin
 * de periodo) y pide confirmación explícita antes de ejecutar el cambio.
 */
function ChangePlanFlow({
  content,
  locale,
  localeTag,
  email,
  subscription,
  plans,
  step,
  selectedPlanId,
  onSelectPlan,
  onAdvance,
  onBack,
  onClose,
  onDone,
}: {
  content: Content
  locale: Locale
  localeTag: string
  email: string
  subscription: Subscription
  plans: Plan[]
  step: 'select' | 'review'
  selectedPlanId: string | null
  onSelectPlan: (planId: string) => void
  onAdvance: () => void
  onBack: () => void
  onClose: () => void
  onDone: () => Promise<void>
}) {
  const d = content.billing.plan.changeDialog
  const { pending, error, run } = useSubscriptionAction(onDone, onClose)

  const currentPlan = plans.find((p) => p.id === subscription.planId) ?? null
  const currentPlanName =
    PLAN_TRANSLATIONS[locale][subscription.planId as PlanId]?.name ?? subscription.planId
  // Planes a los que se puede cambiar: comprables (no a medida, con precio) y
  // distintos del actual.
  const targets = plans.filter(
    (p) => p.priceMonth !== null && !p.custom && p.id !== subscription.planId,
  )
  const selected = targets.find((p) => p.id === selectedPlanId) ?? null

  // Aviso de timing según la regla de dominio (mejora vs. bajada).
  const timing = currentPlan && selected ? planChangeTiming(currentPlan, selected) : null
  const currencySymbol = (plan: Plan) => (plan.currency === 'EUR' ? '€' : plan.currency)

  if (step === 'select') {
    return (
      <Modal
        open
        title={d.title}
        onClose={onClose}
        closeLabel={d.cancel}
        footer={
          <>
            <Button variant="ghost" onClick={onBack}>
              {d.cancel}
            </Button>
            <Button variant="primary" disabled={!selected} onClick={onAdvance}>
              {content.billing.plan.manageDialog.continueLabel}
            </Button>
          </>
        }
      >
        <button type="button" className="modal-back" onClick={onBack}>
          <ArrowLeft size={16} strokeWidth={2} aria-hidden />
          {content.billing.plan.manageDialog.backLabel}
        </button>

        <p className="modal-intro">{d.intro}</p>
        <ul className="plan-picker">
          {targets.map((plan) => {
            const name = PLAN_TRANSLATIONS[locale][plan.id as PlanId]?.name ?? plan.name
            const isSelected = plan.id === selectedPlanId
            return (
              <li key={plan.id}>
                <button
                  type="button"
                  className={`plan-option ${isSelected ? 'plan-option--selected' : ''}`}
                  aria-pressed={isSelected}
                  onClick={() => onSelectPlan(plan.id)}
                >
                  <span className="plan-option__body">
                    <span className="plan-option__radio" aria-hidden />
                    <span className="plan-option__name">{name}</span>
                  </span>
                  <span className="plan-option__price">
                    {plan.priceMonth} {currencySymbol(plan)}
                    {content.billing.plan.pricePeriodMonth}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </Modal>
    )
  }

  // Paso de resumen: precio del plan de destino, tipo de cobro (prorrateo
  // ahora / al final del periodo) y confirmación explícita antes de ejecutar.
  if (!selected) return null // No debería alcanzarse: el paso anterior exige selección.

  return (
    <Modal
      open
      title={d.title}
      onClose={onClose}
      closeLabel={d.cancel}
      footer={
        <>
          <Button variant="ghost" onClick={onBack} disabled={pending}>
            {d.cancel}
          </Button>
          <Button
            variant="primary"
            disabled={pending}
            onClick={() =>
              run(async () => {
                // El periodo se mantiene mensual (el catálogo online solo tiene
                // precios mensuales configurados); si en el futuro hay anual,
                // se elegiría aquí. El timing lo recalcula el servidor.
                const { paymentUrl } = await billingUseCases.changeSubscriptionPlan.execute({
                  email,
                  subscriptionId: subscription.stripeSubscriptionId!,
                  planId: selected.id,
                  period: 'monthly' satisfies BillingPeriod,
                })
                // Upgrade con importe pendiente: se abre la página de factura
                // de Stripe en una pestaña NUEVA (no se navega la actual), así
                // el usuario confirma el cargo (o cambia de tarjeta) sin perder
                // la app. El modal se cierra ya; la sección de facturación
                // detecta cuando la pestaña recupera el foco y refresca sola
                // el estado real (activo si pagó, past_due si no).
                if (paymentUrl) {
                  window.open(paymentUrl, '_blank', 'noopener,noreferrer')
                }
              })
            }
          >
            {timing === 'now_prorated' ? d.confirmUpgrade : d.confirm}
          </Button>
        </>
      }
    >
      <button type="button" className="modal-back" onClick={onBack} disabled={pending}>
        <ArrowLeft size={16} strokeWidth={2} aria-hidden />
        {content.billing.plan.manageDialog.backLabel}
      </button>

      <div className="confirm-summary">
        <div className="confirm-summary__row">
          <span className="confirm-summary__label">{d.currentBadge}</span>
          <span className="confirm-summary__value">{currentPlanName}</span>
        </div>
        <div className="confirm-summary__row confirm-summary__row--highlight">
          <span className="confirm-summary__label">
            {content.billing.plan.manageDialog.newPlanLabel}
          </span>
          <span className="confirm-summary__value">{selected.name}</span>
        </div>
        <div className="confirm-summary__row">
          <span className="confirm-summary__label">
            {content.billing.plan.manageDialog.newPriceLabel}
          </span>
          <span className="confirm-summary__value confirm-summary__value--price">
            {selected.priceMonth} {currencySymbol(selected)}
            {content.billing.plan.pricePeriodMonth}
          </span>
        </div>
      </div>

      <p className="plan-change-note">
        {timing === 'now_prorated'
          ? d.upgradeNote
          : fill(d.downgradeNote, {
              plan: currentPlanName,
              date: formatDate(subscription.currentPeriodEnd, localeTag),
            })}
      </p>
      {error && <p className="modal-error">{content.billing.plan.genericError}</p>}
    </Modal>
  )
}

// --- Sección: Administración de usuarios ------------------------------------
function TeamSection({
  content,
  users,
  selectedOrg,
  onSelectOrg,
}: {
  content: Content
  users: ManagedUser[]
  selectedOrg: string | null
  onSelectOrg: (organizationId: string) => void
}) {
  const c = content.team
  const orgIds = organizationIdsOf(users)
  const visibleUsers = selectedOrg ? usersInOrganization(users, selectedOrg) : []

  return (
    <section className="account-view" aria-label={c.title}>
      <div className="account-view__head">
        <div>
          <h2 className="account-view__title">{c.title}</h2>
          <p className="account-view__desc">{c.description}</p>
        </div>
        <Button variant="primary">{c.inviteButton}</Button>
      </div>

      {orgIds.length > 0 ? (
        <>
          <div className="account-panel">
            <label className="org-select">
              <span className="org-select__label">{c.organizationLabel}</span>
              <select
                className="org-select__input"
                value={selectedOrg ?? ''}
                onChange={(e) => onSelectOrg(e.target.value)}
              >
                {orgIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </label>
            <p className="org-select__count">
              {visibleUsers.length} {c.usersInOrg}
            </p>
          </div>

          <div className="account-panel">
            {visibleUsers.map((u) => (
              <MemberRow key={u.id} user={u} content={content} />
            ))}
          </div>
        </>
      ) : (
        <div className="account-panel">
          <p className="account-empty">{c.emptyUsers}</p>
        </div>
      )}
    </section>
  )
}

function MemberRow({ user, content }: { user: ManagedUser; content: Content }) {
  const c = content.team
  return (
    <div className="member">
      <div className="member__id">
        <span className="member__avatar" aria-hidden>
          {initials(user.derivedName)}
        </span>
        <div style={{ minWidth: 0 }}>
          <p className="member__name">{user.derivedName}</p>
          <p className="member__email">{user.email}</p>
        </div>
      </div>
      <div className="member__meta">
        {user.isFullAdmin && <span className="member__role">{c.fullAdminLabel}</span>}
      </div>
    </div>
  )
}

// --- Sección: Seguridad y sesiones -----------------------------------------
function SecuritySection({
  content,
  sessions,
  localeTag,
}: {
  content: Content
  sessions: DeviceSession[]
  localeTag: string
}) {
  const c = content.security
  const hasOthers = sessions.some((s) => !s.current)

  return (
    <section className="account-view" aria-label={c.title}>
      <div className="account-view__head">
        <div>
          <h2 className="account-view__title">{c.title}</h2>
          <p className="account-view__desc">{c.description}</p>
        </div>
      </div>

      {/* Contraseña */}
      <div className="account-panel">
        <p className="account-panel__title">{c.password.title}</p>
        <div className="payment">
          <div>
            <p className="payment__digits">••••••••••••</p>
            <p className="payment__exp">{c.password.hint}</p>
          </div>
          <Button variant="secondary">{c.password.changeButton}</Button>
        </div>
      </div>

      {/* Sesiones activas */}
      <div className="account-panel">
        <p className="account-panel__title">{c.sessions.title}</p>
        {sessions.map((s) => (
          <SessionRow key={s.id} session={s} content={content} localeTag={localeTag} />
        ))}
      </div>

      {hasOthers && (
        <div className="account-actions">
          <Button variant="destructive">{c.sessions.revokeAllButton}</Button>
        </div>
      )}
    </section>
  )
}

function SessionRow({
  session,
  content,
  localeTag,
}: {
  session: DeviceSession
  content: Content
  localeTag: string
}) {
  const c = content.security.sessions
  const Icon =
    session.platform === 'macos' ? Laptop : session.platform === 'windows' ? Monitor : Smartphone

  return (
    <div className="session">
      <div className="session__id">
        <span className="session__icon" aria-hidden>
          <Icon size={18} strokeWidth={2} />
        </span>
        <div style={{ minWidth: 0 }}>
          <p className="session__device">
            {session.device}
            {session.current && <span className="status-chip status-chip--active">{c.currentLabel}</span>}
          </p>
          <p className="session__meta">
            {session.location} · {c.lastActiveLabel} {formatDateTime(session.lastActiveAt, localeTag)}
          </p>
        </div>
      </div>
      {!session.current && (
        <button
          type="button"
          className="session-revoke"
          aria-label={fill(c.revokeAriaLabel, { device: session.device })}
        >
          {c.revokeLabel}
        </button>
      )}
    </div>
  )
}
