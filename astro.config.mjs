import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import node from '@astrojs/node'

const isPagesBuild = process.env.DEPLOY_TARGET === 'pages'

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
    '/': '/es/',
    '/planes': '/es/planes',
    '/cuenta': '/es/cuenta',
    '/empresa': '/es/empresa',
    '/login': '/es/login',
    '/registro': '/es/registro',
    '/checkout': '/es/checkout',
    '/confirmar-cuenta': '/es/confirmar-cuenta',
    '/recursos': '/es/recursos',
  },
  // Dev en localhost:3000: el backend permite este origen, así que el navegador
  // llama directo al API (sin proxy de Vite).
  server: {
    port: 3000,
  },
})
