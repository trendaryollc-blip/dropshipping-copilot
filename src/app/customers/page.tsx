import CrmHub from "@/components/customers/crm-hub"

export const metadata = {
  title: "CRM - DropEase",
}

export default function CustomersPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-2">Customer Relationship Management</h1>
      <p className="mb-6 text-sm text-muted-foreground">Contacts, segmentation, automations, email/SMS, GDPR, and audit logs.</p>
      <CrmHub />
    </main>
  )
}
