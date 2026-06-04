export interface TenantConfig {
  id: string
  name: string
  plan: string
  locale: string
  currency: string
  enabled: boolean
}

const tenants: TenantConfig[] = [
  { id: "tenant-1", name: "North America Store", plan: "Growth", locale: "en", currency: "USD", enabled: true },
  { id: "tenant-2", name: "EU Market", plan: "Starter", locale: "de", currency: "EUR", enabled: true },
  { id: "tenant-3", name: "Latin America Store", plan: "Enterprise", locale: "es", currency: "USD", enabled: false },
]

let activeTenantId = tenants[0].id

export async function listTenants(): Promise<TenantConfig[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...tenants]), 200))
}

export async function getActiveTenant(): Promise<TenantConfig | null> {
  const tenant = tenants.find((item) => item.id === activeTenantId) || null
  return new Promise((resolve) => setTimeout(() => resolve(tenant), 200))
}

export async function switchTenant(tenantId: string): Promise<TenantConfig | null> {
  const tenant = tenants.find((item) => item.id === tenantId) || null
  if (tenant) {
    activeTenantId = tenantId
  }
  return new Promise((resolve) => setTimeout(() => resolve(tenant), 200))
}

export async function updateTenant(tenantId: string, updates: Partial<TenantConfig>): Promise<TenantConfig | null> {
  const tenant = tenants.find((item) => item.id === tenantId) || null
  if (!tenant) return null
  Object.assign(tenant, updates)
  return new Promise((resolve) => setTimeout(() => resolve({ ...tenant }), 200))
}
