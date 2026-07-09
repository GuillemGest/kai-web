import { defineConfig } from 'astro/config'
import react from '@astrojs/react'

export default defineConfig({
  integrations: [react()],
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
    '/recursos': '/es/recursos',
  },
})
