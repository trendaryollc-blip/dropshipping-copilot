"use client";

import { useEffect, useState } from "react";

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const eventLabels = ["orderUpdates", "productUpdates", "automationAlerts", "weeklyDigest", "billingAlerts"];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({ email: true, inApp: true, orderUpdates: true, productUpdates: true, automationAlerts: true, weeklyDigest: true, billingAlerts: true, browser: false });

  useEffect(() => {
    fetch("/api/notifications").then((response) => response.json()).then((data) => setNotifications(data.notifications ?? []));
  }, []);

  function markAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
    fetch("/api/notifications", { method: "PATCH" });
  }

  async function requestBrowserNotifications() {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setPreferences((current) => ({ ...current, browser: permission === "granted" }));
  }

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-4">
        <div><h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Notifications</h1><p className="mt-1.5 text-sm text-zinc-400">In-app, email, browser, and event-level notification preferences.</p></div>
        <button onClick={markAllRead} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm hover:bg-zinc-900">Mark all read</button>
      </header>
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-medium text-zinc-100">Preferences</h2><button onClick={requestBrowserNotifications} className="rounded-lg border border-zinc-700 px-3 py-2 text-sm">Enable browser notifications</button></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{["email", "inApp", ...eventLabels].map((key) => <label key={key} className="flex items-center justify-between rounded-lg bg-zinc-950 p-3 text-sm"><span>{key}</span><input type="checkbox" checked={preferences[key] ?? false} onChange={() => setPreferences((current) => ({ ...current, [key]: !current[key] }))} /></label>)}</div>
      </section>
      <section className="space-y-3">
        {notifications.map((notification) => <article key={notification.id} className={`rounded-xl border p-5 ${notification.read ? "border-zinc-800 bg-zinc-900/30" : "border-emerald-500/30 bg-emerald-500/10"}`}><div className="flex items-start justify-between gap-4"><div><p className="text-xs uppercase tracking-wide text-zinc-500">{notification.type}</p><h2 className="mt-1 font-medium text-zinc-100">{notification.title}</h2><p className="mt-2 text-sm text-zinc-400">{notification.message}</p></div><span className="text-xs text-zinc-500">{new Date(notification.createdAt).toLocaleString()}</span></div></article>)}
      </section>
    </div>
  );
}
