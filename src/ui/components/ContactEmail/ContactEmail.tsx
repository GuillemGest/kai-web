import { useEffect, useRef, useState, type ReactNode } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'
import { Button } from '../Button/Button'
import { ORIGINS } from '../../../config/appUrls'
import './ContactEmail.css'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'small' | 'default' | 'large'

export interface ContactEmailLabels {
  /** Encabezado del popover, p. ej. "Escríbenos a". */
  heading: string
  copy: string
  copied: string
  openInGmail: string
  openInOutlook: string
  openInApp: string
}

const DEFAULT_LABELS: ContactEmailLabels = {
  heading: 'Escríbenos a',
  copy: 'Copiar',
  copied: 'Copiado',
  openInGmail: 'Abrir en Gmail',
  openInOutlook: 'Abrir en Outlook',
  openInApp: 'Tu app de correo',
}

interface ContactEmailProps {
  email: string
  subject?: string
  body?: string
  /** Texto/contenido del botón disparador (el CTA visible). */
  children: ReactNode
  variant?: Variant
  size?: Size
  /**
   * Si se pasa, el disparador es un <button> plano con esta clase (para reutilizar
   * estilos de CTA propios, p. ej. `shop__enterprise-cta`). Si se omite, el
   * disparador es el <Button> del sistema con `variant`/`size`.
   */
  triggerClassName?: string
  labels?: Partial<ContactEmailLabels>
}

/**
 * CTA de contacto por email que NO fuerza el cliente de correo del sistema.
 *
 * Un `mailto:` abre el cliente por defecto del SO (Outlook en Windows), lo que
 * deja fuera a quien usa webmail. En su lugar, al pulsar se despliega un popover
 * con la dirección, un botón "Copiar" y accesos directos a Gmail y Outlook web,
 * más el `mailto:` para quien sí tenga app de correo. El usuario elige.
 *
 * Componente de presentación reutilizable (sin reglas de negocio): se monta como
 * isla en las páginas Astro y directamente en las islas React que ya existían.
 */
export function ContactEmail({
  email,
  subject,
  body,
  children,
  variant = 'primary',
  size = 'default',
  triggerClassName,
  labels,
}: ContactEmailProps) {
  const t = { ...DEFAULT_LABELS, ...labels }
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Cerrar al hacer clic fuera o pulsar Escape.
  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  // El aviso "Copiado" vuelve a "Copiar" tras un par de segundos.
  useEffect(() => {
    if (!copied) return
    const id = window.setTimeout(() => setCopied(false), 2000)
    return () => window.clearTimeout(id)
  }, [copied])

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
    } catch {
      // Portapapeles no disponible (contexto no seguro, permiso denegado…):
      // el usuario siempre tiene los enlaces y el propio texto a la vista.
    }
  }

  // URLs de composición: Gmail y Outlook web reciben destinatario/asunto/cuerpo
  // por query; el mailto sirve de fallback para clientes de escritorio.
  const gmailUrl = new URL(ORIGINS.gmailCompose)
  gmailUrl.searchParams.set('view', 'cm')
  gmailUrl.searchParams.set('to', email)
  if (subject) gmailUrl.searchParams.set('su', subject)
  if (body) gmailUrl.searchParams.set('body', body)

  const outlookUrl = new URL(ORIGINS.outlookCompose)
  outlookUrl.searchParams.set('to', email)
  if (subject) outlookUrl.searchParams.set('subject', subject)
  if (body) outlookUrl.searchParams.set('body', body)

  const mailtoParams = new URLSearchParams()
  if (subject) mailtoParams.set('subject', subject)
  if (body) mailtoParams.set('body', body)
  const mailtoQuery = mailtoParams.toString()
  const mailtoUrl = `mailto:${email}${mailtoQuery ? `?${mailtoQuery}` : ''}`

  const toggle = () => setOpen((v) => !v)

  return (
    <div className="contact-email" ref={rootRef}>
      {triggerClassName ? (
        <button
          type="button"
          className={triggerClassName}
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {children}
        </button>
      ) : (
        <Button
          variant={variant}
          size={size}
          onClick={toggle}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {children}
        </Button>
      )}

      {open && (
        <div className="contact-email__pop" role="dialog" aria-label={t.heading}>
          <p className="contact-email__heading">{t.heading}</p>

          <div className="contact-email__address">
            <span className="contact-email__email">{email}</span>
            <button
              type="button"
              className="contact-email__copy"
              onClick={handleCopy}
              aria-live="polite"
            >
              {copied ? (
                <Check size={15} strokeWidth={2.5} aria-hidden />
              ) : (
                <Copy size={15} strokeWidth={2} aria-hidden />
              )}
              {copied ? t.copied : t.copy}
            </button>
          </div>

          <ul className="contact-email__providers">
            <li>
              <a
                className="contact-email__provider"
                href={gmailUrl.toString()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.openInGmail}
                <ExternalLink size={14} strokeWidth={2} aria-hidden />
              </a>
            </li>
            <li>
              <a
                className="contact-email__provider"
                href={outlookUrl.toString()}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.openInOutlook}
                <ExternalLink size={14} strokeWidth={2} aria-hidden />
              </a>
            </li>
            <li>
              <a className="contact-email__provider" href={mailtoUrl}>
                {t.openInApp}
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
