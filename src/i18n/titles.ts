import type { Locale } from './locales'

export type PageKey =
  | 'home'
  | 'shop'
  | 'account'
  | 'company'
  | 'login'
  | 'register'
  | 'resources'
  | 'guide'

export const PAGE_TITLES: Record<PageKey, Record<Locale, string>> = {
  home: { es: 'KAI', en: 'KAI', ca: 'KAI' },
  shop: { es: 'Planes · KAI', en: 'Plans · KAI', ca: 'Plans · KAI' },
  account: { es: 'Mi cuenta · KAI', en: 'My account · KAI', ca: 'El meu compte · KAI' },
  company: { es: 'Sobre KAI', en: 'About KAI', ca: 'Sobre KAI' },
  login: { es: 'Iniciar sesión · KAI', en: 'Log in · KAI', ca: 'Inicia sessió · KAI' },
  register: { es: 'Crear cuenta · KAI', en: 'Create account · KAI', ca: 'Crear compte · KAI' },
  resources: { es: 'Recursos · KAI', en: 'Resources · KAI', ca: 'Recursos · KAI' },
  guide: { es: 'Guía · KAI', en: 'Guide · KAI', ca: 'Guia · KAI' },
}
