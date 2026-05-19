export async function* streamCsvRows(rows: string[][], chunkSize = 50) {
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize)
    yield chunk.map((row) => row.join(',')).join('\n')
  }
}

export function exportLargeCsv(rows: string[][]) {
  const blob = new Blob([rows.map((row) => row.join(',')).join('\n')], { type: 'text/csv' })
  return URL.createObjectURL(blob)
}

export async function importCsvInChunks(file: File, onChunk: (rows: string[][]) => void) {
  const text = await file.text()
  const allRows = text.split(/\r?\n/).map((line) => line.split(','))
  const chunkSize = 50
  for (let i = 0; i < allRows.length; i += chunkSize) {
    onChunk(allRows.slice(i, i + chunkSize))
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
}
