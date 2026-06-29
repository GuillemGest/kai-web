import type { ButtonHTMLAttributes, ReactNode } from 'react'
import './Button.css'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'small' | 'default' | 'large'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

/**
 * Botón del sistema de diseño KAI.
 * Recuerda (DESIGN.md): solo un Primary por vista; orden Ghost → Secondary → Primary.
 */
export function Button({
  variant = 'secondary',
  size = 'default',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button className={`btn btn--${variant} btn--${size} ${className}`.trim()} {...rest}>
      {children}
    </button>
  )
}
