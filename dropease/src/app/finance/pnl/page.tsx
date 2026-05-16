import PnlDashboard from "@/components/finance/pnl-dashboard"

export const metadata = { title: "P&L Dashboard - DropEase" }

export default function PnlPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Profit & Loss Dashboard</h1>
      <PnlDashboard />
    </main>
  )
}
