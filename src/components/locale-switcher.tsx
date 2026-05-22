"use client"

import { getLocale, setLocale, type Locale } from "@/lib/i18n"

export function LocaleSwitcher() {
  const current = getLocale()
  return (
    <select
      className="rounded border px-2 py-1 text-xs"
      value={current}
      onChange={(e) => { setLocale(e.target.value as Locale); window.location.reload() }}
      aria-label="Select language"
    >
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
      <option value="de">Deutsch</option>
    </select>
  )
}
