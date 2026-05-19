import IntegrationManager from '@/components/integrations/integration-manager'

export const metadata = { title: 'Integrations - DropEase' }

export default function IntegrationsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Platform Integrations</h1>
      <IntegrationManager />
    </main>
  )
}
