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
    routing: { prefixDefaultLocale: false },
  },
  vite: {
    server: {
      proxy: {
        // Proxy de desarrollo para el servicio de auth: el navegador llama a
        // nuestro propio origen (/auth-api/*), evitando el preflight CORS, y
        // Vite reenvía por detrás al backend real. Solo aplica en `astro dev`;
        // en producción hará falta CORS en el backend o un proxy equivalente.
        '/auth-api': {
          target: 'https://authentication.amplifysoft.io',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/auth-api/, '/api'),
          // El backend valida el header Origin contra una allowlist (*.amplifysoft.io)
          // y rechaza localhost. Como en dev el navegador manda Origin: localhost:4321,
          // lo reescribimos aquí a un origen permitido para el preflight CORS.
          // Truco solo de desarrollo; en producción el origen real ya será válido.
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.setHeader('origin', 'https://kai.amplifysoft.io')
            })
          },
        },
      },
    },
  },
})
