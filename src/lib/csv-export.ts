import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import * as XLSX from "xlsx"

const defaultFileSuffix = () => new Date().toISOString().split("T")[0]

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

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
  downloadBlob(blob, `${filename}_${defaultFileSuffix()}.csv`)
}

export function exportToXLSX<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  sheetName = "Sheet1"
): void {
  if (!data.length) return

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  downloadBlob(blob, `${filename}_${defaultFileSuffix()}.xlsx`)
}

export async function exportToPDF<T extends Record<string, unknown>>(
  data: T[],
  filename: string,
  title = "Export"
): Promise<void> {
  if (!data.length) return

  const doc = await PDFDocument.create()
  const page = doc.addPage([595, 842])
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const fontSize = 10
  const margin = 40
  const lineHeight = fontSize * 1.4
  let y = 820

  page.drawText(title, {
    x: margin,
    y: y,
    size: 16,
    font,
    color: rgb(0.1, 0.1, 0.1),
  })

  y -= 30
  const headers = Object.keys(data[0])
  page.drawText(headers.join(" | "), {
    x: margin,
    y,
    size: fontSize,
    font,
    color: rgb(0.2, 0.2, 0.2),
  })
  y -= lineHeight

  data.forEach((row) => {
    if (y < 80) {
      const nextPage = doc.addPage([595, 842])
      y = 820
      page.drawText("Continued...", { x: margin, y, size: fontSize, font, color: rgb(0.2, 0.2, 0.2) })
    }
    const rowText = headers
      .map((key) => {
        const val = row[key as keyof T]
        return typeof val === "object" ? JSON.stringify(val) : String(val ?? "")
      })
      .join(" | ")
    page.drawText(rowText, {
      x: margin,
      y,
      size: fontSize,
      font,
      color: rgb(0.1, 0.1, 0.1),
    })
    y -= lineHeight
  })

  const pdfBytes = await doc.save()
  const blob = new Blob([pdfBytes], { type: "application/pdf" })
  downloadBlob(blob, `${filename}_${defaultFileSuffix()}.pdf`)
}
