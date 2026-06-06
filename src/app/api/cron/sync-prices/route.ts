/**
 * Vercel Cron Job: Sync Prices
 * Runs every 6 hours to scrape live prices from Trendaryo and update DropEase products.
 */

import { NextResponse } from 'next/server';
import { updateProductPricesFromTrendaryo } from '@/lib/services/product-price-updater';

// Shared auth helper for cron routes — fail closed if CRON_SECRET is missing.
function authorizeCron(request: Request): NextResponse | null {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${secret}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  // Verify Vercel Cron secret to ensure this is a legitimate cron request
  const authError = authorizeCron(request);
  if (authError) return authError;

  try {
    console.log('[Cron] Starting price sync...');
    const result = await updateProductPricesFromTrendaryo();
    console.log(`[Cron] Price sync completed. Updated: ${result.updatedCount}, Failed: ${result.failedCount}`);
    
    return NextResponse.json({ 
      success: result.success, 
      message: 'Price sync completed',
      updated: result.updatedCount,
      failed: result.failedCount,
      errors: result.errors
    });
  } catch (error) {
    console.error('[Cron] Price sync failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}
