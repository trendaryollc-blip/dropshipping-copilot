"use client";

import { useEffect, useState } from "react";

interface Member { id: string; name: string; email: string; role: string }

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  useEffect(() => {
    fetch("/api/team").then((response) => response.json()).then((data) => setMembers(data.members ?? []));
  }, []);

  async function invite() {
    if (!email) return;
    await fetch("/api/team", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, role }) });
    setMembers((current) => [...current, { id: `pending-${Date.now()}`, name: "Pending invitation", email, role }]);
    setEmail("");
  }

  return (
    <div className="space-y-8">
      <header><h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Team collaboration</h1><p className="mt-1.5 text-sm text-zinc-400">Invite teammates and manage owner, admin, editor, and viewer roles.</p></header>
      <section className="flex flex-wrap gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="teammate@example.com" className="min-w-[260px] flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
        <select value={role} onChange={(event) => setRole(event.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"><option value="admin">Admin</option><option value="editor">Editor</option><option value="viewer">Viewer</option></select>
        <button onClick={invite} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950">Send invite</button>
      </section>
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40">
        {members.map((member) => <div key={member.id} className="flex items-center justify-between border-b border-zinc-800 p-4 last:border-0"><div><p className="font-medium text-zinc-100">{member.name}</p><p className="text-sm text-zinc-500">{member.email}</p></div><span className="rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{member.role}</span></div>)}
      </section>
    </div>
  );
}
