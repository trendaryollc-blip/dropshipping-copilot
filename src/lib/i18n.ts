export type Locale = 'en' | 'es' | 'fr' | 'de'

const messages: Record<Locale, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.crm': 'CRM',
    'nav.shipping': 'Shipping',
    'common.save': 'Save',
    'common.export': 'Export',
    'crm.contacts': 'Contacts',
    'crm.timeline': 'Timeline',
  },
  es: {
    'nav.dashboard': 'Panel',
    'nav.crm': 'CRM',
    'nav.shipping': 'Envíos',
    'common.save': 'Guardar',
    'common.export': 'Exportar',
    'crm.contacts': 'Contactos',
    'crm.timeline': 'Línea de tiempo',
  },
  fr: {
    'nav.dashboard': 'Tableau de bord',
    'nav.crm': 'CRM',
    'nav.shipping': 'Expédition',
    'common.save': 'Enregistrer',
    'common.export': 'Exporter',
    'crm.contacts': 'Contacts',
    'crm.timeline': 'Chronologie',
  },
  de: {
    'nav.dashboard': 'Dashboard',
    'nav.crm': 'CRM',
    'nav.shipping': 'Versand',
    'common.save': 'Speichern',
    'common.export': 'Exportieren',
    'crm.contacts': 'Kontakte',
    'crm.timeline': 'Zeitleiste',
  },
}

const LOCALE_KEY = 'dropease_locale'

export function getLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  return (localStorage.getItem(LOCALE_KEY) as Locale) || 'en'
}

export function setLocale(locale: Locale) {
  if (typeof window !== 'undefined') localStorage.setItem(LOCALE_KEY, locale)
}

export function t(key: string, locale?: Locale): string {
  const loc = locale || getLocale()
  return messages[loc]?.[key] ?? messages.en[key] ?? key
}

export function formatLocalizedDate(date: string | Date, locale?: Locale) {
  const loc = locale || getLocale()
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(loc === 'en' ? 'en-US' : loc).format(d)
}

export function formatLocalizedCurrency(amount: number, currency = 'USD', locale?: Locale) {
  const loc = locale || getLocale()
  const localeMap: Record<Locale, string> = { en: 'en-US', es: 'es-ES', fr: 'fr-FR', de: 'de-DE' }
  return new Intl.NumberFormat(localeMap[loc], { style: 'currency', currency }).format(amount)
}
