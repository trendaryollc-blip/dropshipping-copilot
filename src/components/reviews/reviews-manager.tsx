"use client"
import React, { useEffect, useState } from "react"
import { useReviewsStore } from "@/store/useReviewsStore"
import {
  detectDuplicates,
  fetchReviewsFromPlatform,
  bulkReplyToReviews,
  getReviewAlerts,
  generateReviewWidgetEmbed,
  sendReviewSolicitationEmail,
  type ReviewPlatform,
} from "@/lib/reviews-service"

export default function ReviewsManager() {
  const reviews = useReviewsStore(s => s.reviews)
  const load = useReviewsStore(s => s.load)
  const approve = useReviewsStore(s => s.approve)
  const flag = useReviewsStore(s => s.flag)
  const remove = useReviewsStore(s => s.remove)
  const reply = useReviewsStore(s => s.reply)
  const importCSV = useReviewsStore(s => s.importCSV)
  const exportCSV = useReviewsStore(s => s.exportCSV)

  const [replyText, setReplyText] = useState("")
  const [bulkTemplate, setBulkTemplate] = useState("Thank you for your review!")
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [widgetCode, setWidgetCode] = useState("")
  const alerts = getReviewAlerts(reviews)

  useEffect(() => { load() }, [load])
  useEffect(() => {
    // highlight duplicates in console for now
    const dups = detectDuplicates(reviews)
    if (dups.length) console.info('Potential duplicate review groups:', dups.map(g => g.map(r=>r.id)))
  }, [reviews])

  const importPlatform = async (platform: ReviewPlatform) => {
    const imported = await fetchReviewsFromPlatform(platform)
    const next = [...imported, ...reviews]
    useReviewsStore.setState({ reviews: next })
    const { saveReviewsToLocal } = await import("@/lib/reviews-service")
    saveReviewsToLocal(next)
  }

  return (
    <div className="space-y-4">
      {alerts.length > 0 && (
        <div className="rounded border border-yellow-300 bg-yellow-50 p-3 text-sm">
          {alerts.length} alert(s): low ratings or flagged reviews need attention.
        </div>
      )}

      <div className="bg-card-solid shadow rounded p-4">
        <h3 className="font-semibold">Platform Import</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          {(['shopify', 'amazon', 'ebay', 'trustpilot'] as ReviewPlatform[]).map((p) => (
            <button key={p} onClick={() => importPlatform(p)} className="px-3 py-1 border rounded text-sm capitalize">{p}</button>
          ))}
        </div>
      </div>

      <div className="bg-card-solid shadow rounded p-4">
        <h3 className="font-semibold">Bulk Reply</h3>
        <input value={bulkTemplate} onChange={(e) => setBulkTemplate(e.target.value)} className="border rounded p-2 w-full mt-2" />
        <button
          onClick={() => {
            const updated = bulkReplyToReviews(selectedIds.length ? selectedIds : reviews.map((r) => r.id), bulkTemplate, reviews)
            useReviewsStore.setState({ reviews: updated })
            import("@/lib/reviews-service").then(({ saveReviewsToLocal }) => saveReviewsToLocal(updated))
          }}
          className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm"
        >Reply to {selectedIds.length || reviews.length} reviews</button>
      </div>

      <div className="bg-card-solid shadow rounded p-4">
        <h3 className="font-semibold">Storefront Widget</h3>
        <button onClick={() => setWidgetCode(generateReviewWidgetEmbed())} className="px-3 py-1 border rounded text-sm">Generate embed code</button>
        {widgetCode && <pre className="mt-2 text-xs bg-gray-100 p-2 overflow-x-auto">{widgetCode}</pre>}
      </div>

      <div className="bg-card-solid shadow rounded p-4">
        <h3 className="font-semibold">Review Solicitation</h3>
        <button onClick={() => sendReviewSolicitationEmail('customer@example.com', 'Sample Product')} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Send sample request email</button>
      </div>

      <div className="bg-card-solid shadow rounded p-4">
        <h3 className="font-semibold">Import Reviews (CSV)</h3>
        <input type="file" accept="text/csv" onChange={async (e) => { const f = e.target.files?.[0]; if (f) await importCSV(f) }} />
        <div className="mt-2">
          <button onClick={() => { const url = exportCSV(); if (url) { const a = document.createElement('a'); a.href = url; a.download = `reviews_${Date.now()}.csv`; document.body.appendChild(a); a.click(); a.remove(); } }} className="px-3 py-1 bg-indigo-600 text-white rounded">Export CSV</button>
        </div>
      </div>

      <div className="bg-card-solid shadow rounded p-4">
        <h3 className="font-semibold">Moderation Queue</h3>
        <div className="text-sm text-gray-500">Tip: use templates below to reply faster. Duplicate detection will highlight potential duplicates.</div>
        <ul className="mt-2 space-y-2">
          {reviews.map(r => (
            <li key={r.id} className="p-2 border rounded">
              <input
                type="checkbox"
                className="mr-2"
                checked={selectedIds.includes(r.id)}
                onChange={(e) => setSelectedIds((prev) => e.target.checked ? [...prev, r.id] : prev.filter((id) => id !== r.id))}
              />
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{r.productName || 'Product'} — {r.rating}★</div>
                  <div className="text-sm text-gray-600">{r.title}</div>
                  <div className="text-sm mt-1">{r.body}</div>
                  <div className="text-xs text-gray-400">{r.author} • {r.source} • {r.createdAt}</div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => approve(r.id)} className="px-2 py-1 bg-green-600 text-white rounded text-sm">Approve</button>
                  <button onClick={() => flag(r.id)} className="px-2 py-1 bg-yellow-600 text-white rounded text-sm">Flag</button>
                  <button onClick={() => remove(r.id)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">Remove</button>
                </div>
              </div>

              <div className="mt-3">
                <input placeholder="Reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} className="border rounded p-2 w-full" />
                <div className="mt-2 flex gap-2">
                  <button onClick={() => { if (replyText.trim()) { reply(r.id, 'Support', replyText.trim()); setReplyText('') } }} className="px-3 py-1 bg-blue-600 text-white rounded">Reply</button>
                  <button onClick={() => { const templates = ["Thanks for the feedback!","We're sorry to hear that.","Thanks for your review — happy to help."]; const t = templates[Math.floor(Math.random()*templates.length)]; reply(r.id, 'Support', t) }} className="px-3 py-1 border rounded">Use Template</button>
                </div>
              </div>

              {r.replies && r.replies.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium">Replies</h5>
                  <ul className="mt-2 space-y-1">
                    {r.replies.map(rep => (
                      <li key={rep.id} className="text-sm text-gray-700">{rep.author}: {rep.message} <span className="text-xs text-gray-400">· {rep.createdAt}</span></li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
