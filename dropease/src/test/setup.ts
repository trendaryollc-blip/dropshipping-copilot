// Test setup: ensure globals like `localStorage` are available to tests
{
  const existing = (globalThis as any).localStorage
  if (!existing || typeof existing.clear !== 'function') {
    if (typeof globalThis.window !== 'undefined' && (globalThis as any).window.localStorage && typeof (globalThis as any).window.localStorage.clear === 'function') {
      ;(globalThis as any).localStorage = (globalThis as any).window.localStorage
    } else {
      // simple in-memory mock for localStorage
      const store: Record<string, string> = {}
      ;(globalThis as any).localStorage = {
        getItem(key: string) { return store[key] ?? null },
        setItem(key: string, value: string) { store[key] = String(value) },
        removeItem(key: string) { delete store[key] },
        clear() { for (const k of Object.keys(store)) delete store[k] },
      }
    }
  }
}

// Ensure URL.createObjectURL exists (used by shipping service)
if (typeof (globalThis as any).URL?.createObjectURL !== 'function') {
  ;(globalThis as any).URL = (globalThis as any).URL || {}
  ;(globalThis as any).URL.createObjectURL = function () { return 'blob://mock' }
}

if (typeof (globalThis as any).URL?.revokeObjectURL !== 'function') {
  ;(globalThis as any).URL.revokeObjectURL = function () { /* no-op */ }
}

// Prevent jsdom from trying to navigate when anchors are clicked during tests
if (typeof (HTMLAnchorElement.prototype as any).click !== 'function') {
  ;(HTMLAnchorElement.prototype as any).click = function () { /* no-op */ }
} else {
  const orig = HTMLAnchorElement.prototype.click
  HTMLAnchorElement.prototype.click = function () { /* no-op to avoid navigation */ }
  ;(globalThis as any).__restoreAnchorClick = () => { HTMLAnchorElement.prototype.click = orig }
}
