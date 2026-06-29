import { useEffect, useState } from 'react'
import type { Course } from '../../../domain/entities/Course'
import { enrollmentRepository } from '../../../infrastructure/db'
import { SubmitEnrollment } from '../../../application/use-cases/SubmitEnrollment'
import { stripeService } from '../../../infrastructure/stripe/stripeService'
import { emailService } from '../../../infrastructure/email/emailService'
import { useAuth } from '../../contexts/AuthContext'
import { useLocale } from '../../hooks/useLocale'
import { useUserCourses } from '../../contexts/UserCoursesContext'

interface Props {
  course: Course | null
  isOpen: boolean
  onClose: () => void
}

const submitEnrollment = new SubmitEnrollment(enrollmentRepository)

export function AcquireModal({ course, isOpen, onClose }: Props) {
  const { user } = useAuth()
  const { t, loc } = useLocale()
  const { refresh, isEnrolled } = useUserCourses()
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) { setDone(false); setSaving(false); setError(null); return }
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; document.removeEventListener('keydown', onKey) }
  }, [isOpen, onClose])

  if (!course || !isOpen || !user) return null

  const isFree = !course.precio || course.precio === '0'
  const alreadyOwned = isEnrolled(course.id)
  const displayName = user.user_metadata?.display_name ?? user.user_metadata?.name ?? user.email?.split('@')[0] ?? ''

  const handleConfirmFree = async () => {
    setSaving(true)
    setError(null)
    try {
      await submitEnrollment.execute({
        courseId:  course.id,
        userId:    user.id,
        name:      displayName,
        surnames:  '',
        email:     user.email ?? '',
        phone:     null,
      })
      await refresh()
      setDone(true)
      const courseTitle = loc(course.titulo)
      emailService.send('course-acquired', user.email ?? '', {
        userName: displayName, courseTitle, courseSlug: course.slug, isFree: true,
      })
      emailService.sendAdmin('admin-new-enrollment', {
        userName: displayName, userEmail: user.email, courseTitle, isFree: true,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg.includes('23505') || msg.includes('duplicate')
        ? t.alreadyOwnedError
        : t.acquireError
      )
    } finally {
      setSaving(false)
    }
  }

  const handleCheckout = async () => {
    setSaving(true)
    setError(null)
    try {
      await stripeService.startCheckout(course.id, course.slug, user.id, user.email ?? '')
      // startCheckout redirige, no vuelve aquí en caso de éxito
    } catch (err) {
      setError(err instanceof Error ? err.message : t.paymentError)
      setSaving(false)
    }
  }

  return (
    <>
      <div className="form-inscripcion-overlay active" onClick={onClose} />
      <div className="form-inscripcion active">
        <div className="inscription-form acquire-modal" onClick={e => e.stopPropagation()}>
          <div
            className="acquire-modal-header"
            style={{ backgroundImage: `url('${course.linkImagen}')` }}
          >
            <div className="acquire-modal-header-overlay" />
            <div className="acquire-modal-header-content">
              <span className="acquire-modal-badge">● {t.acquire}</span>
              <h3 className="acquire-modal-title">{loc(course.titulo)}</h3>
              {(course.fechaInicio || course.fechaFin) && (
                <p className="acquire-modal-dates">
                  {course.fechaInicio}{course.fechaFin && course.fechaFin !== course.fechaInicio ? ` — ${course.fechaFin}` : ''}
                </p>
              )}
            </div>
            <button type="button" className="acquire-modal-close" onClick={onClose}>×</button>
          </div>

          <div className="acquire-modal-body">
            {done ? (
              <div style={{ padding: '8px 0', textAlign: 'center', color: 'var(--muted)' }}>
                <p>{t.acquireSuccess} {t.confirmationAt} <strong style={{ color: 'var(--accent)' }}>{user.email}</strong>.</p>
              </div>
            ) : alreadyOwned ? (
              <div style={{ padding: '8px 0', textAlign: 'center', color: 'var(--muted)' }}>
                <p>✓ {t.acquired}</p>
              </div>
            ) : isFree ? (
              <>
                <p style={{ padding: '4px 0 12px', color: 'var(--muted)', fontSize: '0.9rem' }}>
                  {t.acquireConfirmFree}
                </p>
                {error && <p className="auth-error" style={{ marginTop: 8 }}>{error}</p>}
                <div className="form-actions">
                  <button type="button" className="btn-form-submit acquire-modal-pay-btn" disabled={saving} onClick={handleConfirmFree}>
                    {saving ? '…' : t.acquire}
                  </button>
                  <button type="button" className="btn-form-cancel acquire-modal-cancel-btn" onClick={onClose}>{t.cancel}</button>
                </div>
              </>
            ) : (
              <>
                <div className="acquire-price-row">
                  <div className="acquire-price-display">
                    <span className="acquire-price-label">{t.acquireTotalPrice}</span>
                    <span className="acquire-price-value">{course.precio} €</span>
                    <span className="acquire-price-note">{t.vatIncluded}</span>
                  </div>
                  <div className="acquire-secure-box">
                    <span className="acquire-secure-box-label">{t.securePayment}</span>
                    <span className="acquire-stripe-logo">stripe</span>
                  </div>
                </div>
                <p className="acquire-secure-note">
                  <span className="acquire-secure-lock">🔒</span>
                  {t.acquireStripeNote}
                </p>
                {error && <p className="auth-error" style={{ marginTop: 8 }}>{error}</p>}
                <div className="form-actions">
                  <button type="button" className="btn-form-submit acquire-modal-pay-btn" disabled={saving} onClick={handleCheckout}>
                    {saving ? t.redirecting : `${t.pay} ${course.precio} €  →`}
                  </button>
                  <button type="button" className="btn-form-cancel acquire-modal-cancel-btn" onClick={onClose}>{t.cancel}</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
