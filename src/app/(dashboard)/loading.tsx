export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
      <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-800" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/20" />
        ))}
      </div>
      <div className="h-48 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/20" />
    </div>
  );
}