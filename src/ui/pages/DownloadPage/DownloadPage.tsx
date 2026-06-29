import { useEffect, useState } from 'react'
import { Apple, Monitor, Terminal, Download as DownloadIcon } from 'lucide-react'
import { downloadsUseCases } from '../../../modules/downloads/application/factory'
import type { DownloadBuild, OperatingSystem } from '../../../modules/downloads/domain/DownloadBuild'
import { Button } from '../../components/Button/Button'
import './DownloadPage.css'

const OS_META: Record<OperatingSystem, { label: string; icon: typeof Apple }> = {
  windows: { label: 'Windows', icon: Monitor },
  macos: { label: 'macOS', icon: Apple },
  linux: { label: 'Linux', icon: Terminal },
}

export function DownloadPage() {
  const [builds, setBuilds] = useState<DownloadBuild[]>([])

  useEffect(() => {
    downloadsUseCases.getDownloads.execute('kai').then(setBuilds)
  }, [])

  return (
    <div className="page">
      <h1 className="page__title">Descargar KAI</h1>
      <p className="page__lead">
        Elige tu sistema operativo. Necesitarás una suscripción activa para usar el plugin tras la
        instalación.
      </p>

      <div className="downloads page__section">
        {builds.map((build) => {
          const meta = OS_META[build.os]
          const Icon = meta.icon
          return (
            <article key={build.id} className="download-card">
              <Icon size={24} strokeWidth={2} className="download-card__icon" aria-hidden />
              <h2 className="download-card__os">{meta.label}</h2>
              <p className="download-card__version">Versión {build.version}</p>
              <Button variant="primary" size="default" className="download-card__cta">
                <DownloadIcon size={16} strokeWidth={2} aria-hidden />
                Descargar
              </Button>
            </article>
          )
        })}
      </div>
    </div>
  )
}
