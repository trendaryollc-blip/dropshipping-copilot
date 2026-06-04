'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface AIProviderStatus {
  provider: string;
  status: string;
  error?: string;
}

export default function AICreditMonitor() {
  const [providers, setProviders] = useState<AIProviderStatus[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setProviders(data.checks?.aiProviders || []);
    } catch (error) {
      console.error('[AICreditMonitor] Failed to fetch health data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Refresh every 60 seconds
    const interval = setInterval(fetchHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">AI Provider Health</CardTitle>
        <button
          onClick={fetchHealth}
          className="text-muted-foreground hover:text-foreground transition-colors"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </CardHeader>
      <CardContent>
        {providers.length === 0 && !loading && (
          <p className="text-sm text-muted-foreground">No AI providers configured</p>
        )}
        {loading && providers.length === 0 && (
          <p className="text-sm text-muted-foreground">Checking provider status...</p>
        )}
        {providers.length > 0 && (
          <div className="space-y-2">
            {providers.map((provider) => (
              <div key={provider.provider} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {provider.status === 'configured' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : provider.status === 'missing' ? (
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm capitalize">{provider.provider}</span>
                </div>
                <Badge
                  variant={provider.status === 'configured' ? 'default' : provider.status === 'missing' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {provider.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}