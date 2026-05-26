"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/Toast";

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export default function AccountPage() {
  const { user, demoMode } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deleteConfirmInput, setDeleteConfirmInput] = useState("");
  const exportDataRef = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setProfile(data.user);
            setDisplayName(data.user.displayName ?? "");
            setPhotoURL(data.user.photoURL ?? "");
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (demoMode) {
      toast("Profile editing is not available in demo mode.", "info");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName, photoURL }),
      });
      const data = await res.json();
      if (res.ok) {
        setProfile(data.user);
        toast("Profile updated successfully.", "success");
      } else {
        toast(data.error ?? "Update failed.", "error");
      }
    } catch {
      toast("Failed to update profile.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleExport() {
    if (demoMode) {
      toast("Export is not available in demo mode.", "info");
      return;
    }
    setExporting(true);
    setExportError(null);
    setExportMessage(null);
    try {
      const [profileRes, productsRes, suppliersRes, ordersRes] = await Promise.all([
        fetch("/api/auth/me"),
        fetch("/api/products"),
        fetch("/api/suppliers"),
        fetch("/api/orders"),
      ]);
      const [profileData, productsData, suppliersData, ordersData]: Record<string, any>[] = await Promise.all([
        profileRes.ok ? profileRes.json() : {},
        productsRes.ok ? productsRes.json() : {},
        suppliersRes.ok ? suppliersRes.json() : {},
        ordersRes.ok ? ordersRes.json() : {},
      ]);

      const exportData = {
        exportedAt: new Date().toISOString(),
        profile: profileData.user ?? profile,
        products: productsData.products ?? [],
        suppliers: suppliersData.suppliers ?? [],
        orders: ordersData.orders ?? [],
      };
      exportDataRef.current = exportData;

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `autopilot-export-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportMessage(`Exported successfully — ${((blob.size / 1024).toFixed(1))} KB`);
    } catch {
      setExportError("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }

  function handleDeleteAccount() {
    if (demoMode) {
      toast("Account deletion is not available in demo mode.", "info");
      return;
    }
    setDeleteConfirm(new Date().toISOString().split("T")[0].replace(/-/g, ""));
  }

  async function confirmDelete() {
    if (deleteConfirmInput !== deleteConfirm) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await fetch("/api/auth/me", { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast("Account deleted.", "info");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        setDeleteError(data.error ?? "Deletion failed.");
        setDeleting(false);
      }
    } catch {
      setDeleteError("Deletion failed. Please try again.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-32 animate-pulse rounded bg-zinc-800" />
        <div className="h-48 w-full max-w-lg animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/20" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Account</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage your profile and account settings.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-6">
        <div className="flex items-center gap-4">
          {profile?.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.displayName || "Avatar"}
              className="h-16 w-16 rounded-full object-cover border border-zinc-700"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-zinc-800 flex items-center justify-center text-2xl text-zinc-400 border border-zinc-700">
              {profile?.displayName?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}
          <div>
            <p className="font-medium text-zinc-100">{profile?.displayName || "Unnamed User"}</p>
            <p className="text-sm text-zinc-500">{profile?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm text-zinc-300">Display Name</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              maxLength={100}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
              placeholder="Your display name"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm text-zinc-300">Photo URL</label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-zinc-500">
              {demoMode ? "Demo mode — changes are not persisted" : "Changes are saved to your account"}
            </p>
            <button
              type="submit"
              disabled={saving || demoMode}
              className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-red-900/40 bg-red-950/10 p-6 space-y-5">
        <div>
          <h2 className="text-sm font-medium text-red-300">Danger Zone</h2>
          <p className="mt-1 text-xs text-zinc-500">
            These actions are permanent and cannot be undone.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleExport}
            disabled={exporting || demoMode}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? "Exporting…" : "Export My Data"}
          </button>
          <button
            onClick={handleDeleteAccount}
            disabled={deleting || demoMode}
            className="rounded-lg border border-red-800 px-4 py-2 text-sm text-red-400 hover:border-red-700 hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting…" : "Delete Account"}
          </button>
        </div>

        {exportMessage && (
          <p className="text-xs text-emerald-400">{exportMessage}</p>
        )}
        {exportError && (
          <p className="text-xs text-red-400">{exportError}</p>
        )}
        {deleteError && (
          <p className="text-xs text-red-400">{deleteError}</p>
        )}
        {deleteConfirm && (
          <div className="rounded border border-red-900/40 bg-zinc-950/50 p-3 space-y-3">
            <p className="text-xs text-red-400">
              This will permanently delete your account and all associated data. Type{" "}
              <strong>{deleteConfirm}</strong> to confirm.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                value={deleteConfirmInput}
                onChange={(e) => setDeleteConfirmInput(e.target.value)}
                placeholder={deleteConfirm}
                className="flex-1 rounded border border-red-800 bg-zinc-950 px-3 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600"
              />
              <button
                onClick={confirmDelete}
                disabled={deleteConfirmInput !== deleteConfirm || deleting}
                className="rounded border border-red-800 px-4 py-1.5 text-sm text-red-400 hover:bg-red-950/30 disabled:opacity-50"
              >
                Confirm Deletion
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}