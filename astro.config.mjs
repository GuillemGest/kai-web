import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import node from '@astrojs/node'

export default defineConfig({
  integrations: [react()],
  // El sitio es estatico por defecto (todas las paginas de contenido se
  // prerenderizan). Solo los endpoints de Stripe (/api/*) se ejecutan en el
  // servidor: se marcan con `export const prerender = false` en cada archivo.
  // El adapter Node atiende esas rutas on-demand.
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  base: '/',
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
