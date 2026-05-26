import type { Settings } from "@/lib/database/types";

export const DEFAULT_SETTINGS: Omit<Settings, "id" | "userId" | "createdAt" | "updatedAt"> = {
  notifications: {
    email: true,
    slack: false,
  },
  automation: {
    autoFulfillOrders: false,
    autoSyncTracking: true,
    scheduledScans: false,
    scanFrequency: "weekly",
    scanQuery: "trending dropshipping products",
  },
  preferences: {
    defaultCurrency: "USD",
    timezone: "America/New_York",
  },
};

export function mergeSettings(
  stored: Partial<Settings> | null,
  userId: string,
): Settings {
  const now = new Date().toISOString();
  return {
    id: userId,
    userId,
    notifications: { ...DEFAULT_SETTINGS.notifications, ...stored?.notifications },
    automation: { ...DEFAULT_SETTINGS.automation, ...stored?.automation },
    preferences: { ...DEFAULT_SETTINGS.preferences, ...stored?.preferences },
    createdAt: stored?.createdAt ?? now,
    updatedAt: stored?.updatedAt ?? now,
  };
}
