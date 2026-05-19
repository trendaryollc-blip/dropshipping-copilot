/**
 * Exports an array of records to a CSV file download.
 * @param data     Array of objects to export
 * @param filename Base filename (date suffix added automatically)
 * @param columns  Optional column config to control key order & display labels
 */
export function exportToCSV<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  columns?: { key: keyof T; label: string }[]
): void {
  if (!data.length) return

  const cols = columns
    ? columns
    : (Object.keys(data[0]) as (keyof T)[]).map((k) => ({
        key: k,
        label: String(k),
      }))

  const headers = cols.map((c) => `"${c.label}"`).join(",")

  const rows = data.map((row) =>
    cols
      .map((c) => {
        const val = row[c.key]
        if (val === null || val === undefined) return '""'
        if (typeof val === "object")
          return `"${JSON.stringify(val).replace(/"/g, '""')}"`
        return `"${String(val).replace(/"/g, '""')}"`
      })
      .join(",")
  )

  const csv = [headers, ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
