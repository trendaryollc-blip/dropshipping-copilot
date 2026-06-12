const fs=require('fs');
const p='src/components/dashboard/ActivityFeedItem.tsx';
let t=fs.readFileSync(p,'utf8');
const m=/export function ActivityFeedItem\(\{ icon, title, time, accent \}: ActivityFeedItemProps\) \{[\s\S]*?\n\}/m;
const replacement = `export function ActivityFeedItem({ icon, title, time, accent, href }: ActivityFeedItemProps) {
  const item = (
    <div className="group flex items-center gap-4 rounded-2xl border border-border/30 bg-card/40 p-3.5 backdrop-blur-sm transition-all duration-300 hover:border-primary/15 hover:bg-card/60">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent} text-white shadow-md transition-all duration-300 group-hover:scale-110`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug text-foreground">{title}</p>
        <p className="mt-0.5 text-[11px] text-muted-foreground/60">{time}</p>
      </div>
      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  )

  if (!href) return item

  return (
    <Link href={href} className="block" aria-label={title}>
      {item}
    </Link>
  )
}`;
if (!m.test(t)) { console.error('no match'); process.exit(1); }
fs.writeFileSync(p, t.replace(m, replacement), 'utf8');
console.log('patched');
