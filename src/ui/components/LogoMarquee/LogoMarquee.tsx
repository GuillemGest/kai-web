import type { CSSProperties } from 'react'
import './LogoMarquee.css'

export interface MarqueeLogo {
  src: string
  alt: string
}

interface LogoMarqueeProps {
  logos: readonly MarqueeLogo[]
  /** Segundos por vuelta completa. Más alto = más lento. */
  speed?: number
}

function buildGroup(logos: readonly MarqueeLogo[]): MarqueeLogo[] {
  if (logos.length === 0) return []
  const minPerGroup = 8
  const repeats = Math.max(1, Math.ceil(minPerGroup / logos.length))
  return Array.from({ length: repeats }, () => logos).flat()
}

function MarqueeGroup({
  logos,
  ariaHidden,
}: {
  logos: readonly MarqueeLogo[]
  ariaHidden?: boolean
}) {
  return (
    <ul className="logo-marquee__group" aria-hidden={ariaHidden || undefined}>
      {logos.map((logo, index) => (
        <li key={`${logo.src}-${index}`} className="logo-marquee__item">
          <img
            className="logo-marquee__logo"
            src={logo.src}
            alt={ariaHidden ? '' : logo.alt}
            loading="lazy"
            draggable={false}
          />
        </li>
      ))}
    </ul>
  )
}

function MarqueeRow({ logos, speed }: { logos: readonly MarqueeLogo[]; speed: number }) {
  const group = buildGroup(logos)

  return (
    <div className="logo-marquee__row">
      <div
        className="logo-marquee__track"
        style={{ '--marquee-duration': `${speed}s` } as CSSProperties}
      >
        <MarqueeGroup logos={group} />
        <MarqueeGroup logos={group} ariaHidden />
        <MarqueeGroup logos={group} ariaHidden />
      </div>
    </div>
  )
}

/**
 * Una fila de logos en blanco monocromo, en bucle continuo sin costuras.
 */
export function LogoMarquee({ logos, speed = 32 }: LogoMarqueeProps) {
  if (logos.length === 0) return null

  return (
    <div className="logo-marquee" role="group" aria-label="Empresas que confían en KAI">
      <MarqueeRow logos={logos} speed={speed} />
    </div>
  )
}
