// Test setup: ensure globals like localStorage are available
// Simple polyfills for node environment
try {
  if (typeof HTMLAnchorElement === 'undefined') {
    (globalThis as any).HTMLAnchorElement = class {}
  }
} catch {}

// Ensure localStorage exists
if (typeof (globalThis as any).localStorage?.clear !== 'function') {
  const store: Record<string, string> = {}
  ;(globalThis as any).localStorage = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = String(value) },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { for (const k of Object.keys(store)) delete store[k] },
  }
}

// Mock URL methods
if (typeof (globalThis as any).URL?.createObjectURL !== 'function') {
  ;(globalThis as any).URL = (globalThis as any).URL || {}
  ;(globalThis as any).URL.createObjectURL = () => 'blob://mock'
  ;(globalThis as any).URL.revokeObjectURL = () => {}
}