/**
 * Vercel Cron Job: Check Automation Rules
 * Runs every 15 minutes to evaluate and trigger automation rules.
 * 
 * Supported rule types:
 * - fulfillment: auto-fulfill pending orders
 * - price_monitoring: check for price changes on tracked products
 * - email_marketing: send triggered email campaigns
 * - inventory: check stock levels and trigger alerts
 * - reorder: automatically reorder low-stock products
 */

import { NextResponse } from 'next/server';
import { getCollection, addDocument } from '@/lib/firestore-service';
import { EmailService } from '@/lib/email-service';
import { fulfillmentEngine } from '@/lib/automation/fulfillment-engine';

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

interface AutomationRule {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
  conditions?: Record<string, any>;
  stats?: Record<string, any>;
}

export async function GET(request: Request) {
  // Verify Vercel Cron secret
  const authError = authorizeCron(request);
  if (authError) return authError;

  try {
    console.log('[Cron] Checking automation rules...');
    
    // Fetch all enabled automation rules
    const rules = await getCollection<AutomationRule>('copilot_automation_rules');
    const enabledRules = rules.filter((r) => r.enabled === true);

    let evaluatedCount = 0;
    let triggeredCount = 0;
    const results: Array<{ ruleId: string; ruleName: string; action: string; success: boolean }> = [];

    for (const rule of enabledRules) {
      evaluatedCount++;
      console.log(`[Cron] Evaluating rule: ${rule.name} (Type: ${rule.type})`);

      try {
        switch (rule.type) {
          case 'fulfillment': {
            // Process pending orders via the fulfillment engine
            const fulfillmentResult = await fulfillmentEngine.processPendingOrders();
            if (fulfillmentResult.processed > 0) {
              triggeredCount++;
              results.push({
                ruleId: rule.id,
                ruleName: rule.name,
                action: `Fulfilled ${fulfillmentResult.processed} orders`,
                success: true,
              });
            }
            break;
          }

          case 'price_monitoring': {
            // Check for products that need price sync
            const { updateProductPricesFromTrendaryo } = await import('@/lib/services/product-price-updater');
            const priceResult = await updateProductPricesFromTrendaryo();
            if (priceResult.updatedCount > 0) {
              triggeredCount++;
              results.push({
                ruleId: rule.id,
                ruleName: rule.name,
                action: `Updated ${priceResult.updatedCount} product prices`,
                success: priceResult.success,
              });
            }
            break;
          }

          case 'email_marketing': {
            // Check for triggered email campaigns (abandoned carts, order follow-ups)
            const conditions = rule.conditions as Record<string, any> | undefined;
            const triggers = conditions?.triggers as string[] | undefined;
            if (triggers?.includes('abandoned_cart')) {
              // Query for abandoned carts (carts older than threshold)
              const pendingEmails = await getCollection('copilot_email_campaigns');
              const dueCampaigns = pendingEmails.filter((c: any) => 
                c.status === 'scheduled' && new Date(c.scheduledFor) <= new Date()
              );
              for (const campaign of dueCampaigns) {
                try {
                  await EmailService.sendEmail({
                    to: (campaign as any).recipientEmail || '',
                    subject: (campaign as any).subject || 'You left something in your cart!',
                    html: (campaign as any).template || '<p>Complete your order now.</p>',
                  });
                  triggeredCount++;
                  results.push({
                    ruleId: rule.id,
                    ruleName: rule.name,
                    action: `Sent email: ${(campaign as any).subject}`,
                    success: true,
                  });
                } catch (emailErr) {
                  console.warn(`[Cron] Failed to send campaign email:`, emailErr);
                }
              }
            }
            break;
          }

          case 'inventory': {
            // Check stock levels for low-stock alerts
            const products = await getCollection('copilot_products');
            const conditions = rule.conditions as Record<string, any> | undefined;
            const lowStockThreshold = conditions?.lowStockThreshold || 10;
            
            for (const product of products) {
              const prod = product as any;
              if (prod.stock !== undefined && prod.stock <= lowStockThreshold && prod.stock > 0) {
                // Create inventory alert
                await addDocument('copilot_inventory_alerts', {
                  productId: prod.id,
                  productName: prod.name,
                  currentStock: prod.stock,
                  threshold: lowStockThreshold,
                  level: 'low',
                  triggeredAt: new Date().toISOString(),
                  acknowledged: false,
                });
                triggeredCount++;
                results.push({
                  ruleId: rule.id,
                  ruleName: rule.name,
                  action: `Low stock alert for ${prod.name} (${prod.stock} remaining)`,
                  success: true,
                });
              }
            }
            break;
          }

          case 'reorder': {
            // Auto-reorder products below critical threshold
            const products = await getCollection('copilot_products');
            const conditions = rule.conditions as Record<string, any> | undefined;
            const criticalStock = conditions?.criticalStockThreshold || 5;
            
            for (const product of products) {
              const prod = product as any;
              if (prod.stock !== undefined && prod.stock <= criticalStock && conditions?.autoReorder) {
                // Add to reorder queue
                await addDocument('copilot_reorder_rules', {
                  productId: prod.id,
                  productName: prod.name,
                  quantity: conditions?.reorderQuantity || 50,
                  status: 'pending',
                  triggeredAt: new Date().toISOString(),
                });
                triggeredCount++;
                results.push({
                  ruleId: rule.id,
                  ruleName: rule.name,
                  action: `Auto-reorder triggered for ${prod.name}`,
                  success: true,
                });
              }
            }
            break;
          }

          default:
            console.log(`[Cron] Unknown rule type: ${rule.type}`);
        }
      } catch (ruleError) {
        console.error(`[Cron] Error evaluating rule ${rule.name}:`, ruleError);
        results.push({
          ruleId: rule.id,
          ruleName: rule.name,
          action: `Error: ${(ruleError as Error).message}`,
          success: false,
        });
      }
    }

    console.log(`[Cron] Automation rules check completed. Evaluated: ${evaluatedCount}, Triggered: ${triggeredCount}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Automation rules checked',
      evaluated: evaluatedCount,
      triggered: triggeredCount,
      results,
    });
  } catch (error) {
    console.error('[Cron] Automation rules check failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}