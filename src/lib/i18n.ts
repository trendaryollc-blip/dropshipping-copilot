export type Locale = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt'

const messages: Record<Locale, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.crm': 'CRM',
    'nav.shipping': 'Shipping',
    'nav.billing': 'Billing',
    'nav.branding': 'Branding',
    'nav.reports': 'Reports',
    'common.save': 'Save',
    'common.export': 'Export',
    'common.exportXlsx': 'Export XLSX',
    'common.exportPdf': 'Export PDF',
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
    'nav.billing': 'Facturation',
    'nav.branding': 'Marque',
    'nav.reports': 'Rapports',
    'common.save': 'Enregistrer',
    'common.export': 'Exporter',
    'common.exportXlsx': 'Exporter XLSX',
    'common.exportPdf': 'Exporter PDF',
    'crm.contacts': 'Contacts',
    'crm.timeline': 'Chronologie',
  },
  de: {
    'nav.dashboard': 'Dashboard',
    'nav.crm': 'CRM',
    'nav.shipping': 'Versand',
    'nav.billing': 'Abrechnung',
    'nav.branding': 'Marke',
    'nav.reports': 'Berichte',
    'common.save': 'Speichern',
    'common.export': 'Exportieren',
    'common.exportXlsx': 'Exportieren XLSX',
    'common.exportPdf': 'Exportieren PDF',
    'crm.contacts': 'Kontakte',
    'crm.timeline': 'Zeitleiste',
  },
  it: {
    'nav.dashboard': 'Cruscotto',
    'nav.crm': 'CRM',
    'nav.shipping': 'Spedizione',
    'nav.billing': 'Fatturazione',
    'nav.branding': 'Branding',
    'nav.reports': 'Report',
    'common.save': 'Salva',
    'common.export': 'Esporta',
    'common.exportXlsx': 'Esporta XLSX',
    'common.exportPdf': 'Esporta PDF',
    'crm.contacts': 'Contatti',
    'crm.timeline': 'Cronologia',
  },
  pt: {
    'nav.dashboard': 'Painel',
    'nav.crm': 'CRM',
    'nav.shipping': 'Envio',
    'nav.billing': 'Faturamento',
    'nav.branding': 'Marca',
    'nav.reports': 'Relatórios',
    'common.save': 'Salvar',
    'common.export': 'Exportar',
    'common.exportXlsx': 'Exportar XLSX',
    'common.exportPdf': 'Exportar PDF',
    'crm.contacts': 'Contatos',
    'crm.timeline': 'Linha do tempo',
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
  const localeMap: Record<Locale, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-BR',
  }
  return new Intl.NumberFormat(localeMap[loc], { style: 'currency', currency }).format(amount)
}
