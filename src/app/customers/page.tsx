import CustomerList from "@/components/customers/customer-list"

export const metadata = {
  title: "Customers - DropEase",
}

export default function CustomersPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Customer Management</h1>
      <CustomerList />
    </main>
  )
}
