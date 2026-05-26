"use client";

import { useEffect, useMemo, useState } from "react";
import { exportToCSV, exportToXLSX } from "@/lib/utils/export";
import { toast } from "@/components/Toast";

interface ProductVariant {
  title: string;
  sku: string;
  price: number;
  inventory: number;
}

interface Product {
  id: string;
  name: string;
  niche?: string;
  category?: string;
  trend?: string;
  estimatedMargin?: string;
  score?: number;
  whyItWins?: string;
  unitCost?: number;
  retailPrice?: number;
  tags?: string[];
  status?: "researching" | "saved" | "listed" | "archived";
  images?: string[];
  variants?: ProductVariant[];
  createdAt: string;
}

interface SupplierMatch {
  name: string;
  platform: "cj" | "zendrop" | "aliexpress" | "ai" | "custom";
  unitCost: number;
  shippingDays: string;
  rating: number;
  productSku?: string;
  productUrl?: string;
}

const emptyForm = {
  name: "",
  niche: "",
  category: "",
  score: "75",
  unitCost: "5",
  retailPrice: "19.99",
  tags: "",
  whyItWins: "",
};

export default function ProductLibraryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [supplierProduct, setSupplierProduct] = useState<Product | null>(null);
  const [supplierResults, setSupplierResults] = useState<SupplierMatch[]>([]);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [variantDraft, setVariantDraft] = useState<ProductVariant>({ title: "Default", sku: "", price: 0, inventory: 0 });

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    try {
      const response = await fetch("/api/products");
      const data = await response.json();
      setProducts(data.products ?? []);
    } catch {
      toast("Failed to load products.", "error");
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct() {
    if (!form.name.trim()) {
      toast("Product name is required.", "error");
      return;
    }

    const payload = {
      name: form.name.trim(),
      niche: form.niche.trim() || "General",
      category: form.category.trim() || form.niche.trim() || "General",
      score: Number(form.score || 75),
      unitCost: Number(form.unitCost || 0),
      retailPrice: Number(form.retailPrice || 0),
      tags: form.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      whyItWins: form.whyItWins.trim() || "Manually added product ready for validation.",
      status: "saved",
      variants: [{ title: "Default", sku: `SKU-${Date.now()}`, price: Number(form.retailPrice || 0), inventory: 100 }],
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Save failed");
      setProducts((current) => [data.product ?? { id: data.id, createdAt: new Date().toISOString(), ...payload }, ...current]);
      setForm(emptyForm);
      setShowForm(false);
      toast("Product saved.", "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Failed to save product.", "error");
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    const response = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (response.ok) {
      setProducts((current) => current.filter((product) => product.id !== id));
      setSelectedIds((current) => {
        const next = new Set(current);
        next.delete(id);
        return next;
      });
      toast("Product deleted.", "success");
    } else {
      toast("Failed to delete product.", "error");
    }
  }

  async function bulkDelete() {
    if (!selectedIds.size || !confirm(`Delete ${selectedIds.size} selected products?`)) return;
    await Promise.all(Array.from(selectedIds).map((id) => fetch(`/api/products/${id}`, { method: "DELETE" })));
    setProducts((current) => current.filter((product) => !selectedIds.has(product.id)));
    setSelectedIds(new Set());
    toast("Selected products deleted.", "success");
  }

  function bulkUpdateStatus(status: Product["status"]) {
    setProducts((current) => current.map((product) => selectedIds.has(product.id) ? { ...product, status } : product));
    toast(`Updated ${selectedIds.size} products to ${status}.`, "success");
  }

  async function runSupplierMatch(product: Product) {
    setSupplierProduct(product);
    setSupplierResults([]);
    setSupplierLoading(true);
    try {
      const response = await fetch("/api/automation/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: product.name }),
      });
      const data = await response.json();
      setSupplierResults(data.output?.suppliers ?? data.suppliers ?? []);
    } catch {
      toast("Supplier search failed.", "error");
    } finally {
      setSupplierLoading(false);
    }
  }

  async function uploadImage(product: Product, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/uploads", { method: "POST", body: formData });
    const data = await response.json();
    if (!response.ok) {
      toast(data.error ?? "Image upload failed.", "error");
      return;
    }
    const imageUrl = data.asset.url as string;
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, images: [...(item.images ?? []), imageUrl] } : item));
    setEditingProduct((current) => current && current.id === product.id ? { ...current, images: [...(current.images ?? []), imageUrl] } : current);
    toast("Placeholder image uploaded.", "success");
  }

  async function publishProduct(product: Product) {
    const response = await fetch("/api/storefront/publish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: product.name, description: product.whyItWins, price: product.retailPrice ?? 0, tags: product.tags, images: product.images, variants: product.variants }),
    });
    const data = await response.json();
    if (response.ok) {
      setProducts((current) => current.map((item) => item.id === product.id ? { ...item, status: "listed" } : item));
      toast(`Published placeholder listing: ${data.result.url}`, "success");
    } else {
      toast("Publishing failed.", "error");
    }
  }

  function addVariant(product: Product) {
    const variant = { ...variantDraft, sku: variantDraft.sku || `SKU-${Date.now()}` };
    const variants = [...(product.variants ?? []), variant];
    setProducts((current) => current.map((item) => item.id === product.id ? { ...item, variants } : item));
    setEditingProduct({ ...product, variants });
    setVariantDraft({ title: "Default", sku: "", price: product.retailPrice ?? 0, inventory: 0 });
  }

  function importCsv(file: File) {
    const reader = new FileReader();
    reader.onload = async () => {
      const text = String(reader.result ?? "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      const [headerLine, ...rows] = lines;
      const headers = headerLine.split(",").map((header) => header.trim().replace(/^"|"$/g, ""));
      let imported = 0;
      for (const row of rows) {
        const values = row.split(",").map((value) => value.trim().replace(/^"|"$/g, ""));
        const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
        if (record.name) {
          await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(record),
          });
          imported += 1;
        }
      }
      toast(`Imported ${imported} products.`, "success");
      fetchProducts();
    };
    reader.readAsText(file);
  }

  const niches = useMemo(() => Array.from(new Set(products.map((product) => product.niche ?? product.category).filter(Boolean))) as string[], [products]);
  const filteredProducts = products.filter((product) => {
    const matchesSearch = `${product.name} ${product.whyItWins ?? ""} ${(product.tags ?? []).join(" ")}`.toLowerCase().includes(search.toLowerCase());
    const matchesNiche = nicheFilter === "all" || product.niche === nicheFilter || product.category === nicheFilter;
    const matchesStatus = statusFilter === "all" || (product.status ?? "saved") === statusFilter;
    return matchesSearch && matchesNiche && matchesStatus;
  });

  const selectedRows = filteredProducts.filter((product) => selectedIds.has(product.id));
  const exportRows = (selectedRows.length ? selectedRows : filteredProducts).map((product) => ({
    name: product.name,
    niche: product.niche ?? product.category ?? "",
    status: product.status ?? "saved",
    score: product.score ?? "",
    margin: product.estimatedMargin ?? "",
    unitCost: product.unitCost ?? "",
    retailPrice: product.retailPrice ?? "",
    tags: (product.tags ?? []).join("; "),
    whyItWins: product.whyItWins ?? "",
  }));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">Product library</h1>
          <p className="mt-1.5 text-sm text-zinc-400">Manage products, images, variants, publishing, imports, exports, and sourcing.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900">
            Import CSV
            <input type="file" accept=".csv" className="hidden" onChange={(event) => event.target.files?.[0] && importCsv(event.target.files[0])} />
          </label>
          <button onClick={() => exportToCSV("products-library", exportRows)} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-900">CSV</button>
          <button onClick={() => exportToXLSX("products-library", exportRows)} className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs hover:bg-zinc-900">XLSX</button>
          <button onClick={() => setShowForm((value) => !value)} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-zinc-950 hover:bg-emerald-400">Add product</button>
        </div>
      </header>

      {showForm && (
        <section className="grid gap-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 sm:grid-cols-2">
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Product name" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={form.niche} onChange={(event) => setForm({ ...form, niche: event.target.value })} placeholder="Niche" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Category" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={form.tags} onChange={(event) => setForm({ ...form, tags: event.target.value })} placeholder="Tags, comma separated" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={form.score} onChange={(event) => setForm({ ...form, score: event.target.value })} placeholder="Score" type="number" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={form.unitCost} onChange={(event) => setForm({ ...form, unitCost: event.target.value })} placeholder="Unit cost" type="number" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <input value={form.retailPrice} onChange={(event) => setForm({ ...form, retailPrice: event.target.value })} placeholder="Retail price" type="number" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" />
          <textarea value={form.whyItWins} onChange={(event) => setForm({ ...form, whyItWins: event.target.value })} placeholder="Why it wins" className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm sm:col-span-2" />
          <div className="sm:col-span-2 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="rounded-lg border border-zinc-700 px-4 py-2 text-sm">Cancel</button>
            <button onClick={saveProduct} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950">Save product</button>
          </div>
        </section>
      )}

      <section className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/20 p-4">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search products, tags, or notes..." className="min-w-[260px] flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-sm" />
        <select value={nicheFilter} onChange={(event) => setNicheFilter(event.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"><option value="all">All niches</option>{niches.map((niche) => <option key={niche} value={niche}>{niche}</option>)}</select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm"><option value="all">All statuses</option><option value="saved">Saved</option><option value="listed">Listed</option><option value="archived">Archived</option></select>
        {selectedIds.size > 0 && <><button onClick={() => bulkUpdateStatus("listed")} className="rounded-lg border border-emerald-800 px-3 py-2 text-xs text-emerald-300">Mark listed</button><button onClick={() => bulkUpdateStatus("archived")} className="rounded-lg border border-zinc-700 px-3 py-2 text-xs">Archive</button><button onClick={bulkDelete} className="rounded-lg border border-red-800 px-3 py-2 text-xs text-red-300">Delete selected ({selectedIds.size})</button></>}
      </section>

      {loading ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse rounded-xl border border-zinc-800 bg-zinc-900/20" />)}</div> : filteredProducts.length === 0 ? <div className="rounded-xl border border-dashed border-zinc-800 p-12 text-center text-sm text-zinc-500">No products found.</div> : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <article key={product.id} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex items-start justify-between gap-3">
                <input type="checkbox" checked={selectedIds.has(product.id)} onChange={() => setSelectedIds((current) => { const next = new Set(current); next.has(product.id) ? next.delete(product.id) : next.add(product.id); return next; })} className="mt-1 h-4 w-4" />
                <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400">{product.niche ?? product.category ?? "General"}</span>
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-300">{product.score ?? "—"}/100</span>
              </div>
              {(product.images ?? [])[0] && <img src={(product.images ?? [])[0]} alt="" className="mt-4 h-32 w-full rounded-lg object-cover" />}
              <h3 className="mt-4 font-medium text-zinc-100">{product.name}</h3>
              <p className="mt-3 line-clamp-3 text-sm text-zinc-400">{product.whyItWins ?? "No notes yet."}</p>
              <div className="mt-3 flex flex-wrap gap-1">{(product.tags ?? []).slice(0, 5).map((tag) => <span key={tag} className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">#{tag}</span>)}</div>
              <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-zinc-400"><div className="rounded-lg bg-zinc-950 p-2">Cost: ${Number(product.unitCost ?? 0).toFixed(2)}</div><div className="rounded-lg bg-zinc-950 p-2">Retail: ${Number(product.retailPrice ?? 0).toFixed(2)}</div></div>
              <div className="mt-5 grid grid-cols-2 gap-2"><button onClick={() => runSupplierMatch(product)} className="rounded-lg border border-zinc-700 py-2 text-xs hover:bg-zinc-900">Source</button><button onClick={() => setEditingProduct(product)} className="rounded-lg border border-zinc-700 py-2 text-xs hover:bg-zinc-900">Manage</button><button onClick={() => publishProduct(product)} className="rounded-lg border border-emerald-800 py-2 text-xs text-emerald-300 hover:bg-emerald-950/30">Publish</button><button onClick={() => deleteProduct(product.id)} className="rounded-lg border border-red-800 py-2 text-xs text-red-300 hover:bg-red-950/30">Delete</button></div>
            </article>
          ))}
        </div>
      )}

      {supplierProduct && <SupplierModal product={supplierProduct} loading={supplierLoading} suppliers={supplierResults} onClose={() => setSupplierProduct(null)} />}

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex justify-between border-b border-zinc-800 pb-3"><h2 className="text-lg font-medium text-zinc-50">Manage {editingProduct.name}</h2><button onClick={() => setEditingProduct(null)}>Close</button></div>
            <section className="mt-5 space-y-3"><h3 className="font-medium text-zinc-100">Images</h3><label className="block cursor-pointer rounded-lg border border-dashed border-zinc-700 p-4 text-center text-sm text-zinc-400">Upload placeholder image<input type="file" accept="image/*" className="hidden" onChange={(event) => event.target.files?.[0] && uploadImage(editingProduct, event.target.files[0])} /></label><div className="grid gap-3 sm:grid-cols-3">{(editingProduct.images ?? []).map((image) => <img key={image} src={image} alt="" className="h-28 rounded-lg object-cover" />)}</div></section>
            <section className="mt-6 space-y-3"><h3 className="font-medium text-zinc-100">Variants</h3><div className="grid gap-2 sm:grid-cols-4"><input value={variantDraft.title} onChange={(event) => setVariantDraft({ ...variantDraft, title: event.target.value })} className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" placeholder="Title" /><input value={variantDraft.sku} onChange={(event) => setVariantDraft({ ...variantDraft, sku: event.target.value })} className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" placeholder="SKU" /><input value={variantDraft.price} onChange={(event) => setVariantDraft({ ...variantDraft, price: Number(event.target.value) })} className="rounded border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm" type="number" placeholder="Price" /><button onClick={() => addVariant(editingProduct)} className="rounded bg-emerald-500 px-3 py-2 text-sm text-zinc-950">Add</button></div>{(editingProduct.variants ?? []).map((variant) => <div key={variant.sku} className="flex justify-between rounded-lg bg-zinc-950 p-3 text-sm"><span>{variant.title} · {variant.sku}</span><span>${variant.price} · {variant.inventory} in stock</span></div>)}</section>
          </div>
        </div>
      )}
    </div>
  );
}

function SupplierModal({ product, loading, suppliers, onClose }: { product: Product; loading: boolean; suppliers: SupplierMatch[]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4">
      <div className="w-full max-w-2xl rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3"><h2 className="text-lg font-medium text-zinc-50">Supplier matches for {product.name}</h2><button onClick={onClose} className="text-zinc-400 hover:text-zinc-100">Close</button></div>
        {loading ? <p className="py-8 text-center text-sm text-zinc-400">Searching placeholder supplier catalogs...</p> : <div className="mt-4 space-y-3">{suppliers.map((supplier) => <div key={`${supplier.platform}-${supplier.productSku ?? supplier.name}`} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 p-4"><div><p className="font-medium text-zinc-100">{supplier.name}</p><p className="text-xs text-zinc-500">{supplier.platform} · {supplier.shippingDays} days · {supplier.rating}/5</p></div><p className="font-semibold text-emerald-300">${supplier.unitCost.toFixed(2)}</p></div>)}</div>}
      </div>
    </div>
  );
}
