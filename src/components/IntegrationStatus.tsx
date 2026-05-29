"use client";

import { useEffect, useState } from "react";

interface StatusResponse {
  integrations: Record<string, boolean>;
  readyForLive: boolean;
  message: string;
}

export function IntegrationStatusBanner() {
  const [status, setStatus] = useState<StatusResponse | null>(null);

  useEffect(() => {
    fetch("/api/settings/status")
      .then((r) => r.json())
      .then((data) => setStatus(data))
      .catch(() => setStatus(null));
  }, []);

  if (!status || !status.integrations) return null;

  const connected = Object.entries(status.integrations).filter(([, v]) => v);

  return (
    <p className="text-xs text-zinc-500">
      {connected.length > 0
        ? `Connected: ${connected.map(([k]) => k).join(", ")}`
        : "No integrations connected"}
      {status.readyForLive ? " · Live mode" : " · Demo mode available"}
    </p>
  );
}
