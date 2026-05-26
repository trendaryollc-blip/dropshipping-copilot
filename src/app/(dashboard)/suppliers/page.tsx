"use client";

import { useState, useEffect } from "react";
import { AutomationRunner } from "@/components/AutomationRunner";
import { toast } from "@/components/Toast";

interface SupplierMatch {
  name: string;
  platform: "cj" | "zendrop" | "aliexpress" | "ai" | "custom";
  unitCost: number;
  shippingDays: string;
  rating: number;
  productSku?: string;
  productUrl?: string;
}

interface SavedSupplier {
  id: string;
  name: string;
  platform: string;
  unitCost: number;
  shippingDays: string;
  rating: number;
  productSku?: string;
  productUrl?: string;
  createdAt: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<SavedSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImportForm, setShowImportForm] = useState(false);
  const [pendingSuppliers, setPendingSuppliers] = useState<SupplierMatch[] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState("");

  // Add form state
  const [addForm, setAddForm] = useState({
    name: "", platform: "custom", unitCost: "", shippingDays: "", rating: "",
  });
  const [addSaving, setAddSaving] = useState(false);

  // Import form state
  const [importUrl, setImportUrl] = useState("");
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");

  useEffect(() => { fetchSuppliers(); }, []);

  async function fetchSuppliers() {
    try {
      const res = await fetch("/api/suppliers");
      if (res.ok) {
        const data = await res.json();
        setSuppliers(data.suppliers ?? []);
      }
    } catch (err) {
      console.error("Failed to load suppliers:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/suppliers/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuppliers((prev) => prev.filter((s) => s.id !== id));
        toast("Supplier removed.", "success");
      } else {
        toast("Failed to delete supplier.", "error");
      }
    } catch {
      toast("Error deleting supplier.", "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSaveSuppliers(productName: string, matches: SupplierMatch[]) {
    setSelectedProduct(productName);
    setPendingSuppliers(matches);
    setShowSaveForm(true);
  }

  async function confirmSaveAll() {
    if (!pendingSuppliers) return;
    let saved = 0;
    for (const s of pendingSuppliers) {
      try {
        const res = await fetch("/api/suppliers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: s.name,
            platform: s.platform,
            unitCost: s.unitCost,
            shippingDays: s.shippingDays,
            rating: s.rating,
            productSku: s.productSku,
            productUrl: s.productUrl,
            sourceProduct: selectedProduct,
          }),
        });
        if (res.ok) saved++;
      } catch {}
    }
    toast(`Saved ${saved} supplier${saved !== 1 ? "s" : ""} to library.`, "success");
    setShowSaveForm(false);
    setPendingSuppliers(null);
    fetchSuppliers();
  }

  async function handleAddSupplier() {
    if (!addForm.name.trim()) {
      toast("Supplier name is required.", "error");
      return;
    }
    setAddSaving(true);
    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: addForm.name.trim(),
          platform: addForm.platform,
          unitCost: addForm.unitCost ? parseFloat(addForm.unitCost) : 0,
          shippingDays: addForm.shippingDays,
          rating: addForm.rating ? parseFloat(addForm.rating) : 0,
        }),
      });
      if (res.ok) {
        toast("Supplier added.", "success");
        setShowAddForm(false);
        setAddForm({ name: "", platform: "custom", unitCost: "", shippingDays: "", rating: "" });
        fetchSuppliers();
      } else {
        toast("Failed to add supplier.", "error");
      }
    } catch {
      toast("Error adding supplier.", "error");
    } finally {
      setAddSaving(false);
    }
  }

  async function handleImportSupplier() {
    if (!importUrl.trim()) {
      setImportError("Please enter a URL.");
      return;
    }
    setImportLoading(true);
    setImportError("");
    try {
      const res = await fetch("/api/suppliers/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        toast("Supplier imported successfully.", "success");
        setShowImportForm(false);
        setImportUrl("");
        fetchSuppliers();
      } else {
        const err = await res.json().catch(() => ({}));
        setImportError(err.error || "Import failed.");
      }
    } catch {
      setImportError("Network error during import.");
    } finally {
      setImportLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Supplier match</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Compare suppliers by cost, shipping time, and reliability.
          Save matches to your supplier library for future reference.
        </p>
      </header>

      <AutomationRunner
        moduleId="suppliers"
        title="Find suppliers"
        description="Match a product to the best supplier options. Plug in AliExpress, CJ, or Zendrop credentials in Settings."
        fields={[
          {
            name: "productName",
            label: "Product name",
            placeholder: "Portable neck fan",
          },
        ]}
        onResult={(result) => {
          if (result.output?.suppliers && Array.isArray(result.output.suppliers) && result.output.suppliers.length) {
            handleSaveSuppliers(
              (result.output.product as string) ?? "",
              result.output.suppliers as SupplierMatch[],
            );
          }
        }}
      />

      {/* Saved Suppliers List */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-zinc-200">Saved Suppliers</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImportForm(true)}
              className="text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-700 px-3 py-1 rounded"
            >
              Import from URL
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-700 px-3 py-1 rounded"
            >
              + Add Supplier
            </button>
            <button
              onClick={fetchSuppliers}
              className="text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-700 px-3 py-1 rounded"
            >
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/20" />
            ))}
          </div>
        ) : suppliers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 p-8 text-center">
            <p className="text-sm text-zinc-500">
              No saved suppliers yet. Run a supplier search and save matches from the results.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {suppliers.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 px-5 py-4 hover:border-zinc-700 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-zinc-100 text-sm">{s.name}</p>
                    <span className="rounded bg-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 uppercase tracking-wide">
                      {s.platform}
                    </span>
                    {s.rating > 0 && (
                      <span className="text-[10px] text-zinc-500">★ {s.rating.toFixed(1)}</span>
                    )}
                    {s.shippingDays && (
                      <span className="text-[10px] text-zinc-500">· {s.shippingDays}d shipping</span>
                    )}
                  </div>
                  {s.productSku && (
                    <p className="text-[10px] text-zinc-600 mt-0.5">SKU: {s.productSku}</p>
                  )}
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-semibold text-emerald-400">${s.unitCost.toFixed(2)}</span>
                  {s.productUrl && (
                    <a
                      href={s.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-400 hover:text-emerald-300 underline"
                    >
                      Catalog
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                    className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
                  >
                    {deletingId === s.id ? "..." : "Remove"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Save confirmation modal */}
      {showSaveForm && pendingSuppliers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-medium text-zinc-50">Save Suppliers</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Save {pendingSuppliers.length} supplier{pendingSuppliers.length !== 1 ? "s" : ""} for "{selectedProduct}" to your library?
              </p>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {pendingSuppliers.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-3">
                  <div>
                    <p className="text-sm text-zinc-200">{s.name}</p>
                    <p className="text-xs text-zinc-500">{s.platform} · {s.shippingDays} days</p>
                  </div>
                  <span className="font-semibold text-emerald-400">${s.unitCost.toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
              <button
                onClick={() => { setShowSaveForm(false); setPendingSuppliers(null); }}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveAll}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400"
              >
                Save All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier modal */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-medium text-zinc-50">Add Supplier</h3>
              <p className="mt-1 text-sm text-zinc-400">Manually add a supplier to your library.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Supplier Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. FastShip Express"
                  value={addForm.name}
                  onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Platform</label>
                <select
                  value={addForm.platform}
                  onChange={(e) => setAddForm((p) => ({ ...p, platform: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus:border-emerald-500 focus:outline-none"
                >
                  <option value="custom">Custom</option>
                  <option value="cj">CJ Dropshipping</option>
                  <option value="zendrop">Zendrop</option>
                  <option value="aliexpress">AliExpress</option>
                  <option value="ai">AI Generated</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Unit Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={addForm.unitCost}
                    onChange={(e) => setAddForm((p) => ({ ...p, unitCost: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1">Shipping (days)</label>
                  <input
                    type="text"
                    placeholder="7–14"
                    value={addForm.shippingDays}
                    onChange={(e) => setAddForm((p) => ({ ...p, shippingDays: e.target.value }))}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Rating (0–5)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  placeholder="4.5"
                  value={addForm.rating}
                  onChange={(e) => setAddForm((p) => ({ ...p, rating: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
              <button
                onClick={() => { setShowAddForm(false); setAddForm({ name: "", platform: "custom", unitCost: "", shippingDays: "", rating: "" }); }}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSupplier}
                disabled={addSaving}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
              >
                {addSaving ? "Adding..." : "Add Supplier"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import from URL modal */}
      {showImportForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-medium text-zinc-50">Import Supplier from URL</h3>
              <p className="mt-1 text-sm text-zinc-400">
                Paste a supplier or product page URL to auto-extract supplier details.
              </p>
            </div>
            <div>
              <label className="block text-xs text-zinc-400 mb-1">Source URL</label>
              <input
                type="url"
                placeholder="https://..."
                value={importUrl}
                onChange={(e) => { setImportUrl(e.target.value); setImportError(""); }}
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
              />
              {importError && <p className="mt-1 text-xs text-red-400">{importError}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
              <button
                onClick={() => { setShowImportForm(false); setImportUrl(""); setImportError(""); }}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleImportSupplier}
                disabled={importLoading}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
              >
                {importLoading ? "Importing..." : "Import"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}