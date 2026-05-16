"use client"

import React, { useEffect, useState } from 'react'
import { connectPaymentGateway, getPaymentTransactions, connectAdPlatform, fetchAdSpendData, loadPaymentConnectors, loadAdPlatforms, reconcilePaymentGateway } from '@/lib/connectors-service'
import type { PaymentGatewayConfig, AdPlatformConfig, PaymentTransaction, AdSpendData } from '@/types'

export default function ConnectorManager() {
  const [paymentConnectors, setPaymentConnectors] = useState<PaymentGatewayConfig[]>([])
  const [adPlatforms, setAdPlatforms] = useState<AdPlatformConfig[]>([])
  const [selectedPayment, setSelectedPayment] = useState<'stripe' | 'paypal'>('stripe')
  const [paymentApiKey, setPaymentApiKey] = useState('')
  const [selectedAd, setSelectedAd] = useState<'google_ads' | 'facebook_ads'>('google_ads')
  const [adApiKey, setAdApiKey] = useState('')
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [adSpend, setAdSpend] = useState<AdSpendData | null>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    setPaymentConnectors(loadPaymentConnectors())
    setAdPlatforms(loadAdPlatforms())
  }, [])

  const handlePaymentConnect = async () => {
    const result = await connectPaymentGateway(selectedPayment, paymentApiKey)
    setPaymentConnectors(loadPaymentConnectors())
    setMessage(`${result.provider} connected successfully`)
  }

  const handleAdConnect = async () => {
    const result = await connectAdPlatform(selectedAd, adApiKey)
    setAdPlatforms(loadAdPlatforms())
    setMessage(`${result.provider.replace('_', ' ').toUpperCase()} connected successfully`)
  }

  const loadTransactions = async () => {
    const tx = await getPaymentTransactions()
    setTransactions(tx)
    setMessage('Payment transactions loaded')
  }

  const loadAdSpend = async () => {
    const spend = await fetchAdSpendData(selectedAd)
    setAdSpend(spend)
    setMessage('Ad spend loaded')
  }

  const reconcile = async (provider: 'stripe' | 'paypal') => {
    const result = await reconcilePaymentGateway(provider)
    setMessage(`${provider} reconciliation complete, missing ${result.missingTransactions} transactions`)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold">Payment & Ad Connectors</h3>
        <p className="text-sm text-gray-500 mt-1">Connect payment gateways and ad platforms to reconcile transactions and import spend data.</p>

        <div className="grid gap-4 md:grid-cols-2 mt-4">
          <div className="space-y-3">
            <div className="text-sm font-semibold">Payment Gateway Connection</div>
            <select value={selectedPayment} onChange={(e) => setSelectedPayment(e.target.value as 'stripe' | 'paypal')} className="border rounded p-2 w-full">
              <option value="stripe">Stripe</option>
              <option value="paypal">PayPal</option>
            </select>
            <input value={paymentApiKey} onChange={(e) => setPaymentApiKey(e.target.value)} placeholder="API Key" className="border rounded p-2 w-full" />
            <button onClick={handlePaymentConnect} className="px-3 py-2 bg-indigo-600 text-white rounded">Connect Payment Gateway</button>
            <button onClick={loadTransactions} className="px-3 py-2 bg-slate-600 text-white rounded">Load Recent Transactions</button>
            <div className="space-y-2">
              {paymentConnectors.map((connector) => (
                <div key={connector.provider} className="border rounded p-3">
                  <div className="font-semibold">{connector.provider.toUpperCase()}</div>
                  <div className="text-sm text-gray-500">{connector.accountName}</div>
                  <div className="text-xs mt-2">Last sync: {new Date(connector.lastSync).toLocaleString()}</div>
                  <button onClick={() => reconcile(connector.provider as 'stripe' | 'paypal')} className="mt-2 inline-flex px-2 py-1 bg-emerald-600 text-white rounded text-sm">Reconcile</button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold">Ad Platform Connection</div>
            <select value={selectedAd} onChange={(e) => setSelectedAd(e.target.value as 'google_ads' | 'facebook_ads')} className="border rounded p-2 w-full">
              <option value="google_ads">Google Ads</option>
              <option value="facebook_ads">Facebook Ads</option>
            </select>
            <input value={adApiKey} onChange={(e) => setAdApiKey(e.target.value)} placeholder="API Key" className="border rounded p-2 w-full" />
            <button onClick={handleAdConnect} className="px-3 py-2 bg-indigo-600 text-white rounded">Connect Ad Platform</button>
            <button onClick={loadAdSpend} className="px-3 py-2 bg-slate-600 text-white rounded">Fetch Ad Spend</button>
            <div className="space-y-2">
              {adPlatforms.map((platform) => (
                <div key={platform.provider} className="border rounded p-3">
                  <div className="font-semibold">{platform.accountName}</div>
                  <div className="text-xs text-gray-500">Connected: {platform.connected ? 'Yes' : 'No'}</div>
                  <div className="text-xs">Campaigns: {platform.campaigns}, Last sync: {new Date(platform.lastSync).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <h4 className="font-semibold">Imported Payment & Ad Data</h4>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <div>
            <div className="font-medium">Recent Payment Transactions</div>
            <ul className="mt-2 space-y-2 text-sm">
              {transactions.map((transaction) => (
                <li key={transaction.id} className="border rounded p-2">
                  {transaction.orderId} • ${transaction.amount.toFixed(2)} • {transaction.gateway.toUpperCase()} • {transaction.status}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="font-medium">Most Recent Ad Spend</div>
            {adSpend ? (
              <div className="border rounded p-3 text-sm">
                <div>Platform: {adSpend.provider.replace('_', ' ').toUpperCase()}</div>
                <div>Spend: ${adSpend.spend.toFixed(2)}</div>
                <div>Clicks: {adSpend.clicks}</div>
                <div>Conversions: {adSpend.conversions}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Fetch ad spend to see trends.</div>
            )}
          </div>
        </div>
      </div>

      {message && <div className="text-sm text-green-700">{message}</div>}
    </div>
  )
}
