import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import node from '@astrojs/node'

const isPagesBuild = process.env.DEPLOY_TARGET === 'pages'

// En Pages la app se sirve bajo /kai-web/. Astro prefija con `base` las CLAVES
// de `redirects` (origen), pero NO los VALORES (destino), que se emiten literal
// en el <meta refresh>. Por eso el destino se prefija a mano aquí.
const basePrefix = isPagesBuild ? '/kai-web' : ''
const to = (path) => `${basePrefix}${path}`

export default defineConfig({
  integrations: [react()],
  // Local / hosts con Node: SSR para endpoints /api/* (prerender = false).
  // GitHub Pages: build 100% estatico. El workflow elimina src/pages/api
  // antes de compilar (Stripe no funciona en Pages, es solo demo visual).
  output: 'static',
  base: isPagesBuild ? '/kai-web/' : '/',
  ...(isPagesBuild
    ? { site: 'https://guillemgest.github.io' }
    : { adapter: node({ mode: 'standalone' }) }),
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'ca'],
    routing: { prefixDefaultLocale: true },
  },
  redirects: {
    '/': to('/es/'),
    '/planes': to('/es/planes'),
    '/cuenta': to('/es/cuenta'),
    '/empresa': to('/es/empresa'),
    '/login': to('/es/login'),
    '/registro': to('/es/registro'),
    '/checkout': to('/es/checkout'),
    '/confirmar-cuenta': to('/es/confirmar-cuenta'),
    '/recursos': to('/es/recursos'),
  },
  // Dev en localhost:3000: el backend permite este origen, así que el navegador
  // llama directo al API (sin proxy de Vite).
  server: {
    port: 3000,
  },
})
