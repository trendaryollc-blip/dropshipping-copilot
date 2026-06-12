/**
 * Vercel Cron Job: Check Automation Rules
 * Runs every 15 minutes to evaluate and trigger automation rules.
 */

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/firestore-service';
import { EmailService } from '@/lib/email-service';
import { SMSService } from '@/lib/sms-service';

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
  // Verify Vercel Cron secret
  const authError = authorizeCron(request);
  if (authError) return authError;

  try {
    console.log('[Cron] Checking automation rules...');
    
    // Fetch all enabled automation rules
    const rules = await getCollection('copilot_automation_rules');
    const enabledRules = rules.filter((r: any) => r.enabled === true);

    let triggeredCount = 0;

    for (const rule of enabledRules) {
      // TODO: Implement actual rule evaluation logic based on rule.type and rule.conditions
      // For now, we just log that the rule was checked
      console.log(`[Cron] Evaluated rule: ${rule.name} (Type: ${rule.type})`);
      triggeredCount++;
    }

    console.log(`[Cron] Automation rules check completed. Evaluated: ${triggeredCount}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Automation rules checked',
      evaluated: triggeredCount
    });
  } catch (error) {
    console.error('[Cron] Automation rules check failed:', error);
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 });
  }
}