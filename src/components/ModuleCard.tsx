import Link from "next/link";
import type { ModuleDefinition } from "@/lib/automation/types";

export function ModuleCard({ module }: { module: ModuleDefinition }) {
  return (
    <Link
      href={module.href}
      className="group block rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-emerald-500/40 hover:bg-zinc-900/80"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xl" aria-hidden>
          {module.icon}
        </span>
        <span className="text-xs text-emerald-400 opacity-0 transition group-hover:opacity-100">
          Open →
        </span>
      </div>
      <h3 className="mt-3 font-semibold text-zinc-50">{module.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">
        {module.description}
      </p>
      <ul className="mt-4 space-y-1">
        {module.capabilities.slice(0, 3).map((cap) => (
          <li key={cap} className="text-xs text-zinc-500">
            • {cap}
          </li>
        ))}
      </ul>
    </Link>
  );
}
