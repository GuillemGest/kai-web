export const LOCALES = ['ca', 'es', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'es'

export const LOCALE_LABELS: Record<Locale, { short: string; long: string }> = {
  es: { short: 'ES', long: 'Español' },
  en: { short: 'EN', long: 'English' },
  ca: { short: 'CA', long: 'Català' },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value)
}
