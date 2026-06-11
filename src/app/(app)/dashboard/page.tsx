"use client"

import { redirect } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useAppStore } from '@/store/useAppStore'
import { useEffect } from 'react'
import OnboardingWizard from '@/components/onboarding-wizard'
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel'
import { InsightsFooterCard } from '@/components/dashboard/InsightsFooter'
import { DollarSign, Package, ShoppingCart, Users, BarChart2, Settings, TrendingUp, AlertCircle, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { isAuthenticated, isInitialised, checkAuth } = useAuthStore()
  const { users, getUsers } = useAppStore()

  // Check authentication status on page load
  if (isAuthenticated === null) {
    checkAuth()
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    redirect('/auth/login')
  }

  // Fetch users data
  useEffect(() => {
    getUsers()
  }, [])

  // Show onboarding if not initialised
  if (!isInitialised) {
    return <OnboardingWizard />
  }

  const filteredUsers = users.filter(user => user.isOnboarded)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome to DropEase Dashboard</h1>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AIInsightsPanel
          title="Total Customers"
          description="Total unique customers"
          value={users.length.toString()}
          trend="↑ 14.7%"
          icon={<Users className="h-4 w-4 text-primary" />}
          link="/customers"
          linkText="View Customers"
        />
        <AIInsightsPanel
          title="Active Customers"
          description="Customers with active status"
          value={filteredUsers.length.toString()}
          trend="↑ 8.3%"
          icon={<ShoppingCart className="h-4 w-4 text-primary" />}
          link="/customers"
          linkText="View Customers"
        />
        <AIInsightsPanel
          title="Lifetime Value"
          description="Average customer lifetime value"
          value="$1,245.67"
          trend="↑ 5.2%"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          link="/analytics"
          linkText="View Analytics"
        />
        <AIInsightsPanel
          title="Recent Activity"
          description="Customers with recent activity"
          value="42"
          trend="↑ 12.5%"
          icon={<Clock className="h-4 w-4 text-primary" />}
          link="/customers"
          linkText="View Customers"
        />
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <AIInsightsPanel
          title="Conversion Rate"
          description="Average order value"
          value="$78.23"
          trend="↑ 3.1%"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          link="/analytics"
          linkText="View Analytics"
        />
        <AIInsightsPanel
          title="Return Rate"
          description="Percentage of returns"
          value="3.7%"
          trend="↓ 0.5%"
          icon={<AlertCircle className="h-4 w-4 text-primary" />}
          link="/returns"
          linkText="View Returns"
        />
        <AIInsightsPanel
          title="Stock Level"
          description="Low stock items"
          value="12"
          trend="↑ 2.1%"
          icon={<BarChart2 className="h-4 w-4 text-primary" />}
          link="/inventory"
          linkText="View Inventory"
        />
        <AIInsightsPanel
          title="Trending Products"
          description="Products with highest trend scores"
          value="15"
          trend="↑ 15.2%"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          link="/products/trending"
          linkText="View Trends"
        />
      </div>

      {/* Footer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <InsightsFooterCard
          title="Product Trends"
          description="See what's trending in your niche"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          link="/products/trending"
          linkText="View Trends"
        />
        <InsightsFooterCard
          title="P&L Statement"
          description="View your profit and loss"
          icon={<DollarSign className="h-4 w-4 text-primary" />}
          link="/finance/pnl"
          linkText="View P&L"
        />
        <InsightsFooterCard
          title="Supplier Performance"
          description="Track your supplier performance"
          icon={<Users className="h-4 w-4 text-primary" />}
          link="/suppliers"
          linkText="View Suppliers"
        />
        <InsightsFooterCard
          title="Marketing Insights"
          description="Get insights on your marketing campaigns"
          icon={<ShoppingCart className="h-4 w-4 text-primary" />}
          link="/marketing"
          linkText="View Marketing"
        />
      </div>
    </div>
  )
}