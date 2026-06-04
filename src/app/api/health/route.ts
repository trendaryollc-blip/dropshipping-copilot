/**
 * Health Check API Endpoint
 * Returns real-time status of all AI providers, Firebase connection, and API latency.
 * 
 * GET /api/health
 */

import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/firestore-service';
import { createTrendaryoAPI } from '@/lib/integrations/trendaryo-api';
import { verifyAllKeys } from '@/lib/ai/verify-keys';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    firebase: { status: string; latency?: number; error?: string };
    trendaryo: { status: string; error?: string };
    aiProviders: Array<{ provider: string; status: string; error?: string }>;
    environment: { status: string; missingVars: string[] };
  };
}

export async function GET() {
  const missingVars: string[] = [];

  // Required environment variables check
  const requiredVars = [
    'TRENDARYO_API_KEY',
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ];
  
  for (const envVar of requiredVars) {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  }

  // Firebase connectivity check
  let firebaseStatus = { status: 'unknown', latency: 0, error: '' };
  try {
    const fbStart = Date.now();
    await getCollection('dropease_products');
    firebaseStatus = {
      status: 'connected',
      latency: Date.now() - fbStart,
      error: '',
    };
  } catch (error) {
    firebaseStatus = {
      status: 'disconnected',
      latency: 0,
      error: (error as Error).message,
    };
  }

  // Trendaryo connection check
  let trendaryoStatus = { status: 'unknown', error: '' };
  try {
    const api = createTrendaryoAPI();
    const result = await api.connect();
    trendaryoStatus = {
      status: result.connected ? 'connected' : 'disconnected',
      error: result.error || '',
    };
  } catch (error) {
    trendaryoStatus = {
      status: 'disconnected',
      error: (error as Error).message,
    };
  }

  // AI Provider key health check
  let aiProviders: Array<{ provider: string; status: string; error?: string }> = [];
  try {
    const keyStatus = await verifyAllKeys();
    aiProviders = Object.entries(keyStatus).map(([provider, status]) => ({
      provider,
      status: status.valid ? 'configured' : 'missing',
      error: status.error || undefined,
    }));
  } catch (error) {
    aiProviders = [{ provider: 'all', status: 'error', error: (error as Error).message }];
  }

  // Determine overall status
  const hasCriticalFailure = firebaseStatus.status === 'disconnected' || missingVars.length > 0;
  const hasDegradation = trendaryoStatus.status === 'disconnected' || aiProviders.some(p => p.status === 'missing');
  
  const overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 
    hasCriticalFailure ? 'unhealthy' :
    hasDegradation ? 'degraded' :
    'healthy';

  const response: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '0.1.0',
    checks: {
      firebase: firebaseStatus,
      trendaryo: trendaryoStatus,
      aiProviders,
      environment: {
        status: missingVars.length === 0 ? 'configured' : 'misconfigured',
        missingVars,
      },
    },
  };

  // Return appropriate status code
  const statusCode = overallStatus === 'unhealthy' ? 503 : 200;

  return NextResponse.json(response, { status: statusCode });
}