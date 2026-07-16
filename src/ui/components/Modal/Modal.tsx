import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import './Modal.css'

interface ModalProps {
  /** Controla la visibilidad. Cuando es `false` no se renderiza nada. */
  open: boolean
  title: string
  /** Cierre por overlay, botón X o tecla Escape. */
  onClose: () => void
  children: ReactNode
  /** Acciones del pie (botones). Se alinean a la derecha. */
  footer?: ReactNode
  closeLabel: string
}

/**
 * Modal accesible del sistema de diseño KAI. Genérico (no sabe de facturación):
 * sirve para confirmaciones y formularios cortos en cualquier panel.
 *
 * Accesibilidad: rol dialog + aria-modal, foco inicial al contenedor, cierre
 * con Escape y bloqueo del scroll del body mientras está abierto.
 */
export function Modal({ open, title, onClose, children, footer, closeLabel }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    // Evita el scroll del fondo mientras el modal está abierto.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  // Portal a <body>: saca el modal del subárbol del panel. Es imprescindible
  // porque algún ancestro (p. ej. `.account-view`, con animación `transform`)
  // crea un contexto de transformación que ancla `position: fixed` a esa caja
  // en vez de al viewport — sin el portal, el overlay solo cubriría el panel y
  // el modal se centraría dentro de él, no en la pantalla.
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal__head">
          <h2 className="modal__title">{title}</h2>
          <button type="button" className="modal__close" onClick={onClose} aria-label={closeLabel}>
            <X size={18} strokeWidth={2} aria-hidden />
          </button>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
