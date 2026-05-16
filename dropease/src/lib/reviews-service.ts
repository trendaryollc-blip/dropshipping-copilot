import type { ProductReview } from "@/types"

const STORAGE_KEY = "dropease_reviews_v1"

export function loadReviewsFromLocal(): ProductReview[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ProductReview[]
  } catch (e) {
    console.error("Failed to load reviews", e)
    return []
  }
}

export function saveReviewsToLocal(reviews: ProductReview[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
  } catch (e) {
    console.error("Failed to save reviews", e)
  }
}

export function generateMockReviews(): ProductReview[] {
  const now = new Date().toISOString()
  return [
    { id: "rev_1", productId: "1", productName: "Wireless Earbuds Pro", rating: 5, title: "Excellent", body: "Great sound and battery.", author: "Alice", source: "Shopify", createdAt: now, moderated: "approved", replies: [] },
    { id: "rev_2", productId: "3", productName: "Portable LED Desk Lamp", rating: 4, title: "Good", body: "Bright and portable.", author: "Bob", source: "Amazon", createdAt: now, moderated: "pending", replies: [] },
  ]
}

export async function importReviewsFromCSV(file: File): Promise<ProductReview[]> {
  const text = await file.text()
  const lines = text.split(/\r?\n/).filter(Boolean)
  const reviews: ProductReview[] = []
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',')
    const map: Record<string, string> = {}
    for (let j = 0; j < headers.length; j++) map[headers[j]] = (cols[j] || '').trim()
    const rev: ProductReview = {
      id: `rev_${Math.random().toString(36).slice(2,9)}`,
      productId: map['productid'] || undefined,
      productName: map['productname'] || undefined,
      rating: Number(map['rating'] || 0),
      title: map['title'] || undefined,
      body: map['body'] || '',
      author: map['author'] || 'import',
      source: map['source'] || 'csv',
      createdAt: map['createdat'] || new Date().toISOString(),
      moderated: 'pending',
      replies: [],
    }
    reviews.push(rev)
  }
  return reviews
}

export function exportReviewsToCSV(reviews: ProductReview[]) {
  const header = ['id','productId','productName','rating','title','body','author','source','createdAt','moderated']
  const rows = reviews.map(r => [r.id, r.productId || '', r.productName || '', String(r.rating), (r.title||'').replace(/\"/g,'""'), (r.body||'').replace(/\"/g,'""'), r.author, r.source||'', r.createdAt, r.moderated||''])
  const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  return URL.createObjectURL(blob)
}

export function sentimentAnalysisPlaceholder(text: string) {
  const score = (text.length % 5) + 1
  return { score, label: score >= 4 ? 'positive' : score === 3 ? 'neutral' : 'negative' }
}

export function detectDuplicates(reviews: ProductReview[]) {
  const groups: ProductReview[][] = []
  for (const r of reviews) {
    const body = (r.body || '').toLowerCase().trim()
    let added = false
    for (const g of groups) {
      for (const m of g) {
        const mb = (m.body || '').toLowerCase().trim()
        if (!mb || !body) continue
        if (mb.startsWith(body) || body.startsWith(mb)) {
          g.push(r)
          added = true
          break
        }
      }
      if (added) break
    }
    if (!added) groups.push([r])
  }
  const duplicates = groups.filter(g => g.length > 1)
  return duplicates
}
