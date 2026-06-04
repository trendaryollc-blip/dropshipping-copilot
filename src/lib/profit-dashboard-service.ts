/**
 * Profit & Loss Dashboard Service
 * Calculates real net profit using actual COGS, supplier costs, shipping, and ad spend data from Firestore.
 */

import { getCollection } from '@/lib/firestore-service';

export interface PnLMetrics {
  totalRevenue: number;
  totalCOGS: number;
  totalShipping: number;
  totalAdSpend: number;
  totalFees: number;
  totalRefunds: number;
  netProfit: number;
  profitMargin: number;
  periodStart: string;
  periodEnd: string;
  topProducts: Array<{
    name: string;
    revenue: number;
    cogs: number;
    profit: number;
    margin: number;
  }>;
}

class ProfitDashboardService {
  /**
   * Calculate real P&L metrics for a given date range
   */
  async calculatePnL(startDate: Date, endDate: Date): Promise<PnLMetrics> {
    try {
      // Fetch all orders in the date range
      const orders = await getCollection('dropease_orders');
      const filteredOrders = orders.filter((o: any) => {
        const orderDate = new Date(o.createdAt || o.orderDate);
        return orderDate >= startDate && orderDate <= endDate;
      });

      // Fetch products to get COGS data
      const products = await getCollection('dropease_products');
      const productMap = new Map(products.map((p: any) => [p.id, p]));

      let totalRevenue = 0;
      let totalCOGS = 0;
      let totalShipping = 0;
      let totalRefunds = 0;
      const productRevenueMap = new Map<string, { revenue: number; cogs: number; name: string }>();

      for (const order of filteredOrders) {
        // Skip cancelled/refunded for revenue but track refunds
        if (order.status === 'cancelled' || order.status === 'refunded') {
          totalRefunds += order.total || 0;
          continue;
        }

        totalRevenue += order.total || 0;
        totalShipping += order.shippingCost || 0;

        // Calculate COGS per item using product data
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            const product = productMap.get(item.productId);
            const itemCOGS = (product?.cogs || product?.supplierPrice || 0) * (item.quantity || 1);
            totalCOGS += itemCOGS;

            // Track per-product metrics
            const existing = productRevenueMap.get(item.productId) || { revenue: 0, cogs: 0, name: product?.name || `Product ${item.productId}` };
            existing.revenue += (item.unitPrice || 0) * (item.quantity || 1);
            existing.cogs += itemCOGS;
            productRevenueMap.set(item.productId, existing);
          }
        }
      }

      // Fetch ad spend from finance records
      const adRecords = await getCollection('dropease_finance_records');
      const adSpendRecords = adRecords.filter((r: any) => 
        r.type === 'ad_spend' && new Date(r.date) >= startDate && new Date(r.date) <= endDate
      );
      const totalAdSpend = adSpendRecords.reduce((sum: number, r: any) => sum + (r.amount || 0), 0);

      // Platform fees (e.g., 2% + $0.30 per transaction)
      const platformFees = totalRevenue * 0.029 + filteredOrders.length * 0.30;

      // Net profit calculation
      const netProfit = totalRevenue - totalCOGS - totalShipping - totalAdSpend - platformFees - totalRefunds;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      // Top products by profit
      const topProducts = Array.from(productRevenueMap.entries())
        .map(([id, data]) => ({
          name: data.name,
          revenue: data.revenue,
          cogs: data.cogs,
          profit: data.revenue - data.cogs,
          margin: data.revenue > 0 ? ((data.revenue - data.cogs) / data.revenue) * 100 : 0,
        }))
        .sort((a, b) => b.profit - a.profit)
        .slice(0, 10);

      return {
        totalRevenue,
        totalCOGS,
        totalShipping,
        totalAdSpend,
        totalFees: platformFees,
        totalRefunds,
        netProfit,
        profitMargin,
        periodStart: startDate.toISOString(),
        periodEnd: endDate.toISOString(),
        topProducts,
      };
    } catch (error) {
      console.error('[ProfitDashboard] Failed to calculate P&L:', error);
      throw error;
    }
  }
}

export const profitDashboardService = new ProfitDashboardService();
export default profitDashboardService;