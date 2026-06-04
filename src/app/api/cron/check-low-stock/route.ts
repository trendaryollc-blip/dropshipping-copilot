/**
 * Vercel Cron Job: Check Low Stock
 * Runs every 12 hours to check for products running low on inventory and send alerts.
 */

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/firestore-service';
import { EmailService } from '@/lib/email-service';

export async function GET(request: Request) {
  // Verify Vercel Cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    console.log('[Cron] Checking low stock products...');
    
    // Fetch all active products
    const products = await getCollection('dropease_products');
    const activeProducts = products.filter((p: any) => p.status === 'active');

    let alertedCount = 0;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@dropease.com';

    for (const product of activeProducts) {
      // Check if product has stock and a low stock threshold
      if (product.stock !== undefined && product.lowStockThreshold !== undefined) {
        if (product.stock <= product.lowStockThreshold) {
          console.log(`[Cron] Low stock alert for: ${product.name} (Stock: ${product.stock}, Threshold: ${product.lowStockThreshold})`);
          
          // Send email alert
          await EmailService.sendLowStockAlert(adminEmail, {
            name: product.name,
            currentStock: product.stock,
            threshold: product.lowStockThreshold,
          });
          
          alertedCount++;
        }
      }
    }

    console.log(`[Cron] Low stock check completed. Alerts sent: ${alertedCount}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Low stock check completed',
      alerted: alertedCount
    });
  } catch (error) {
    console.error('[Cron] Low stock check failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}