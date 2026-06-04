export interface BillingPlan {
  id: string
  name: string
  price: number
  interval: "monthly" | "yearly"
  features: string[]
}

export interface InvoiceItem {
  description: string
  quantity: number
  unitPrice: number
}

export interface Invoice {
  id: string
  customer: string
  currency: string
  amount: number
  status: "paid" | "due" | "overdue"
  dueDate: string
  issuedAt: string
  items: InvoiceItem[]
}

const plans: BillingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    interval: "monthly",
    features: ["Basic order tracking", "Limited supplier connections", "Email support"],
  },
  {
    id: "growth",
    name: "Growth",
    price: 79,
    interval: "monthly",
    features: ["Advanced supplier automation", "Analytics dashboard", "Priority support"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    interval: "monthly",
    features: ["Multi-store / team access", "Custom integrations", "Dedicated onboarding"],
  },
]

const invoices: Invoice[] = [
  {
    id: "INV-2026-001",
    customer: "Acme Dropshipping",
    currency: "USD",
    amount: 249.99,
    status: "paid",
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    items: [
      { description: "Pro subscription", quantity: 1, unitPrice: 249.99 },
    ],
  },
  {
    id: "INV-2026-002",
    customer: "Scale Commerce",
    currency: "USD",
    amount: 119.99,
    status: "due",
    issuedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(),
    items: [
      { description: "Growth subscription", quantity: 1, unitPrice: 119.99 },
    ],
  },
]

export async function getBillingPlans(): Promise<BillingPlan[]> {
  return new Promise((resolve) => setTimeout(() => resolve(plans), 250))
}

export async function getInvoices(): Promise<Invoice[]> {
  return new Promise((resolve) => setTimeout(() => resolve(invoices), 250))
}

export async function createInvoice(invoice: Omit<Invoice, "id">): Promise<Invoice> {
  const nextInvoice: Invoice = {
    ...invoice,
    id: `INV-${Date.now()}`,
  }
  invoices.unshift(nextInvoice)
  return nextInvoice
}

export async function markInvoicePaid(invoiceId: string): Promise<Invoice | null> {
  const invoice = invoices.find((item) => item.id === invoiceId)
  if (invoice) {
    invoice.status = "paid"
  }
  return invoice || null
}
