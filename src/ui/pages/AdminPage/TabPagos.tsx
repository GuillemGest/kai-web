import { useEffect, useState } from 'react'
import type { Organization } from '../../../domain/entities/Organization'
import type { Company } from '../../../domain/entities/Company'
import { companyRepository } from '../../../infrastructure/db'
import { stripeService } from '../../../infrastructure/stripe/stripeService'
import { CompanyOnboardingButton } from '../../../features/companies/CompanyOnboardingButton'

interface Props {
  // Organizaciones (empresas) que el usuario puede administrar. Ya vienen
  // filtradas desde AdminPage según los permisos de gestión.
  manageableOrgs: Organization[]
  // Solo admin_minor/admin_superior de la organización ADMINISTRADOR (plataforma):
  // habilita la edición de la comisión que se cobra a cada empresa.
  canEditFees: boolean
}

// Pestaña "Pagos": gestión de la conexión con Stripe Connect de cada empresa.
// Solo accesible para administradores de la empresa (admin_minor / admin_superior)
// o super admin — el control de acceso se aplica en AdminPage.
export function TabPagos({ manageableOrgs, canEditFees }: Props) {
  const [companies, setCompanies] = useState<Record<string, Company | undefined>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null)
  const [feeInputs, setFeeInputs] = useState<Record<string, string>>({})
  const [savingFeeId, setSavingFeeId] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const entries = await Promise.all(
        manageableOrgs.map(async (org) => [org.id, await companyRepository.getById(org.id)] as const),
      )
      setCompanies(Object.fromEntries(entries))
      setFeeInputs(Object.fromEntries(entries.map(([id, company]) =>
        [id, company?.platformFeePercentage != null ? String(Math.round(company.platformFeePercentage * 100)) : ''],
      )))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar los datos de pago')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [manageableOrgs]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleDisconnect = async (org: Organization) => {
    if (!window.confirm(`¿Desconectar Stripe de "${org.name}"? Se eliminará la cuenta conectada y habrá que repetir el onboarding desde cero.`)) return
    setDisconnectingId(org.id)
    setError(null)
    try {
      await stripeService.disconnectConnectAccount(org.id)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al desconectar Stripe')
    } finally {
      setDisconnectingId(null)
    }
  }

  const handleSaveFee = async (org: Organization) => {
    const raw = feeInputs[org.id]?.trim()
    const feePercentage = raw ? Number(raw) / 100 : null
    if (raw && (Number.isNaN(feePercentage as number) || (feePercentage as number) < 0 || (feePercentage as number) > 1)) {
      setError('La comisión debe ser un número entre 0 y 100')
      return
    }
    setSavingFeeId(org.id)
    setError(null)
    try {
      await stripeService.updatePlatformFee(org.id, feePercentage)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar la comisión')
    } finally {
      setSavingFeeId(null)
    }
  }

  const feeLabel = (company?: Company): string => {
    if (company?.platformFeePercentage == null) return 'Comisión por defecto de la plataforma'
    return `Comisión: ${(company.platformFeePercentage * 100).toFixed(0)}%`
  }

  return (
    <div className="admin-users-section">
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginBottom: 16 }}>
        Conecta cada empresa con <span style={{ color: 'var(--accent)' }}>Stripe</span> para poder vender sus cursos. Los pagos se
        envían automáticamente a la cuenta de <span style={{ color: 'var(--accent)' }}>Stripe</span> de la empresa, descontando la
        comisión de la plataforma. Una empresa no puede vender hasta completar el proceso.
      </p>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <p className="admin-images-loading">Cargando datos de pago…</p>
      ) : manageableOrgs.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No administras ninguna empresa.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {manageableOrgs.map((org) => {
            const company = companies[org.id]
            const connected = company?.stripeOnboardingComplete === true
            const started = !!company?.stripeAccountId

            return (
              <div key={org.id} className="admin-payment-card">
                <div className="admin-payment-card-head">
                  <h3 className="admin-payment-card-title">{org.name}</h3>
                  {connected ? (
                    <span className="admin-replied-badge">✓ Pagos conectados</span>
                  ) : (
                    <span className="admin-pending-badge">
                      {started ? 'Onboarding pendiente' : 'Sin conectar'}
                    </span>
                  )}
                </div>

                {canEditFees ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '4px 0 12px' }}>
                    <label
                      htmlFor={`fee-${org.id}`}
                      style={{ color: 'var(--muted)', fontSize: '0.78rem', flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      Comisión de la plataforma
                    </label>
                    {/* Barra unificada: [−] [número %] [+] [GUARDAR] */}
                    <div style={{ display: 'flex', flex: 1, minWidth: 0 }}>
                      {/* Botón − */}
                      <button
                        type="button"
                        onClick={() => setFeeInputs(prev => ({
                          ...prev,
                          [org.id]: String(Math.max(0, (Number(prev[org.id]) || 0) - 1)),
                        }))}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0 12px', flexShrink: 0, cursor: 'pointer',
                          background: '#13171f', color: 'var(--muted)', fontSize: '1rem',
                          border: '1px solid var(--divider)', borderRight: 'none',
                          borderRadius: '6px 0 0 6px',
                        }}
                      >−</button>

                      {/* Número + % centrados juntos */}
                      <div style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3,
                        background: '#0b0d10',
                        borderTop: '1px solid var(--divider)', borderBottom: '1px solid var(--divider)',
                      }}>
                        <input
                          id={`fee-${org.id}`}
                          type="number"
                          min={0}
                          max={100}
                          step={1}
                          placeholder="5"
                          value={feeInputs[org.id] ?? ''}
                          onChange={e => setFeeInputs(prev => ({ ...prev, [org.id]: e.target.value }))}
                          className="admin-catalog-search"
                          style={{
                            width: 48, minWidth: 0, flex: 'none', textAlign: 'center',
                            border: 'none', background: 'transparent', borderRadius: 0, padding: '7px 0',
                          }}
                        />
                        <span style={{ color: 'var(--muted)', fontSize: '0.85rem', userSelect: 'none', flexShrink: 0 }}>%</span>
                      </div>

                      {/* Botón + */}
                      <button
                        type="button"
                        onClick={() => setFeeInputs(prev => ({
                          ...prev,
                          [org.id]: String(Math.min(100, (Number(prev[org.id]) || 0) + 1)),
                        }))}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          padding: '0 12px', flexShrink: 0, cursor: 'pointer',
                          background: '#13171f', color: 'var(--muted)', fontSize: '1rem',
                          borderTop: '1px solid var(--divider)', borderBottom: '1px solid var(--divider)',
                          borderLeft: 'none', borderRight: 'none',
                        }}
                      >+</button>

                      {/* Botón GUARDAR */}
                      <button
                        type="button"
                        className="admin-btn-secondary"
                        disabled={savingFeeId === org.id}
                        onClick={() => handleSaveFee(org)}
                        style={{
                          background: '#1f2435',
                          borderTop: '1px solid var(--divider)',
                          borderRight: '1px solid var(--divider)',
                          borderBottom: '1px solid var(--divider)',
                          borderLeft: 'none',
                          borderRadius: '0 6px 6px 0',
                        }}
                      >
                        {savingFeeId === org.id ? 'Guardando…' : 'Guardar'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: '4px 0 12px' }}>
                    {feeLabel(company)}
                  </p>
                )}

                {company?.stripeAccountId && (
                  <p style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: '0 0 12px' }}>
                    Cuenta Stripe: <code>{company.stripeAccountId}</code>
                  </p>
                )}

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  {connected ? (
                    <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: 0 }}>
                      Esta empresa ya puede vender cursos. Los pagos se transfieren a su cuenta de <span style={{ color: 'var(--accent)' }}>Stripe</span>.
                    </p>
                  ) : (
                    <CompanyOnboardingButton
                      companyId={org.id}
                      className="admin-btn-primary"
                      label={started ? 'Continuar onboarding' : 'Conectar con Stripe'}
                    />
                  )}

                  {started && (
                    <button
                      type="button"
                      className="admin-btn-danger"
                      disabled={disconnectingId === org.id}
                      onClick={() => handleDisconnect(org)}
                    >
                      {disconnectingId === org.id ? 'Desconectando…' : 'Desconectar Stripe'}
                    </button>
                  )}
                </div>

                {!connected && (
                  <div style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '10px 14px', margin: '12px 0 0',
                    background: 'rgba(180, 40, 40, 0.15)',
                    border: '1px solid rgba(220, 60, 60, 0.3)',
                    borderRadius: 6, fontSize: '0.82rem',
                    color: 'rgba(240, 200, 200, 0.9)', lineHeight: 1.5,
                  }}>
                    <span style={{ flexShrink: 0 }}>⚠</span>
                    <span>
                      Esta empresa <strong style={{ color: '#e03535' }}>no puede vender cursos</strong> hasta conectar Stripe. Los cursos existentes no se podrán vender hasta completar el proceso.
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
