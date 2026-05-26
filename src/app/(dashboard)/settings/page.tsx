"use client";

import { useState, useEffect } from "react";

interface ApiKeyField {
  id: string;
  label: string;
  placeholder: string;
  description: string;
  required: boolean;
  type: "text" | "password" | "url";
}

interface IntegrationSection {
  id: string;
  name: string;
  icon: string;
  description: string;
  fields: ApiKeyField[];
}

const integrations: IntegrationSection[] = [
  {
    id: "trendaryo",
    name: "Trendaryo Store",
    icon: "🏪",
    description: "Connect your custom Trendaryo store for order fulfillment and product sync",
    fields: [
      {
        id: "trendaryo_api_url",
        label: "Trendaryo API URL",
        placeholder: "https://api.trendaryo.com",
        description: "Your Trendaryo backend API endpoint",
        required: true,
        type: "url",
      },
      {
        id: "trendaryo_api_key",
        label: "Trendaryo API Key",
        placeholder: "Enter your API key",
        description: "Authentication key for Trendaryo API",
        required: true,
        type: "password",
      },
    ],
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    icon: "🤖",
    description: "AI-powered product research and copywriting",
    fields: [
      {
        id: "openrouter_api_key",
        label: "OpenRouter API Key",
        placeholder: "sk-or-...",
        description: "Your OpenRouter API key for AI features",
        required: true,
        type: "password",
      },
      {
        id: "openrouter_model",
        label: "OpenRouter Model",
        placeholder: "anthropic/claude-3.5-sonnet",
        description: "AI model to use for generation",
        required: false,
        type: "text",
      },
    ],
  },
  {
    id: "suppliers",
    name: "Supplier APIs",
    icon: "📦",
    description: "Connect to supplier platforms for product sourcing",
    fields: [
      {
        id: "cj_api_key",
        label: "CJ Dropshipping API Key",
        placeholder: "Enter CJ Dropshipping API key",
        description: "API key for CJ Dropshipping integration",
        required: false,
        type: "password",
      },
      {
        id: "zendrop_api_key",
        label: "Zendrop API Key",
        placeholder: "Enter Zendrop API key",
        description: "API key for Zendrop integration",
        required: false,
        type: "password",
      },
      {
        id: "aliexpress_app_key",
        label: "AliExpress App Key",
        placeholder: "Enter AliExpress App Key",
        description: "App key for AliExpress API",
        required: false,
        type: "password",
      },
      {
        id: "aliexpress_secret_key",
        label: "AliExpress Secret Key",
        placeholder: "Enter AliExpress Secret Key",
        description: "Secret key for AliExpress API signing",
        required: false,
        type: "password",
      },
    ],
  },
  {
    id: "storefront",
    name: "Storefront Publishing",
    icon: "🛒",
    description: "Placeholder Shopify/custom storefront listing connection",
    fields: [
      {
        id: "shopify_store_url",
        label: "Shopify Store URL",
        placeholder: "https://your-store.myshopify.com",
        description: "Storefront URL for listing publishing",
        required: false,
        type: "url",
      },
      {
        id: "shopify_access_token",
        label: "Shopify Access Token",
        placeholder: "shpat_placeholder_token",
        description: "Access token for product publishing",
        required: false,
        type: "password",
      },
    ],
  },
  {
    id: "research",
    name: "Research & Trends",
    icon: "📊",
    description: "Data sources for market research and trend analysis",
    fields: [
      {
        id: "meta_api_key",
        label: "Meta Ad Library API Key",
        placeholder: "Enter Meta API key",
        description: "Access Meta Ad Library for competitor research",
        required: false,
        type: "password",
      },
    ],
  },
];

export default function SettingsPage() {
  const [apiKeys, setApiKeys] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [savedStatus, setSavedStatus] = useState<Record<string, "saved" | "error">>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [integrationStatus, setIntegrationStatus] = useState<
    Record<string, boolean>
  >({});
  const [customApis, setCustomApis] = useState<{ id: string; name: string; url: string; key: string }[]>([]);
  const [showAddApi, setShowAddApi] = useState(false);
  const [addApiForm, setAddApiForm] = useState({ name: "", url: "", key: "" });
  const [addApiSaving, setAddApiSaving] = useState(false);
  const [notifPrefs, setNotifPrefs] = useState<{ email: boolean; slack: boolean; slackWebhook: string }>({
    email: true,
    slack: false,
    slackWebhook: "",
  });
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifSaved, setNotifSaved] = useState<"saved" | "error" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("custom_apis");
    if (stored) {
      try { setCustomApis(JSON.parse(stored)); } catch {}
    }
    const load = async () => {
      try {
        const [keysRes, statusRes] = await Promise.all([
          fetch("/api/settings/api-keys"),
          fetch("/api/settings/status"),
        ]);
        if (keysRes.ok) {
          const data = await keysRes.json();
          setApiKeys(data);
        }
        if (statusRes.ok) {
          const status = await statusRes.json();
          setIntegrationStatus(status.integrations ?? {});
        }

        // Load notification preferences
        const prefsRes = await fetch("/api/settings/preferences");
        if (prefsRes.ok) {
          const prefs = await prefsRes.json();
          setNotifPrefs({
            email: prefs.notifications?.email ?? true,
            slack: prefs.notifications?.slack ?? false,
            slackWebhook: prefs.notifications?.slackWebhook ?? "",
          });
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async (integrationId: string) => {
    setSaving((prev) => ({ ...prev, [integrationId]: true }));
    setSavedStatus((prev) => ({ ...prev, [integrationId]: null as any }));

    try {
      const res = await fetch("/api/settings/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiKeys),
      });

      if (res.ok) {
        setSavedStatus((prev) => ({ ...prev, [integrationId]: "saved" }));
        const statusRes = await fetch("/api/settings/status");
        if (statusRes.ok) {
          const status = await statusRes.json();
          setIntegrationStatus(status.integrations ?? {});
        }
      } else {
        setSavedStatus((prev) => ({ ...prev, [integrationId]: "error" }));
      }
    } catch (error) {
      console.error("Failed to save API keys:", error);
      setSavedStatus((prev) => ({ ...prev, [integrationId]: "error" }));
    } finally {
      setSaving((prev) => ({ ...prev, [integrationId]: false }));

      // Clear status after 3 seconds
      setTimeout(() => {
        setSavedStatus((prev) => ({ ...prev, [integrationId]: null as any }));
      }, 3000);
    }
  };

  const togglePasswordVisibility = (fieldId: string) => {
    setShowPassword((prev) => ({ ...prev, [fieldId]: !prev[fieldId] }));
  };

  const handleSaveNotifications = async () => {
    setNotifSaving(true);
    setNotifSaved(null);
    const webhook = notifPrefs.slackWebhook.trim();
    if (notifPrefs.slack && webhook && !webhook.startsWith("https://hooks.slack.com/")) {
      setNotifSaving(false);
      setNotifSaved("error");
      return;
    }
    try {
      const res = await fetch("/api/settings/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: notifPrefs.email,
          slack: notifPrefs.slack,
          slackWebhook: webhook,
        }),
      });
      if (res.ok) {
        setNotifSaved("saved");
      } else {
        setNotifSaved("error");
      }
    } catch {
      setNotifSaved("error");
    } finally {
      setNotifSaving(false);
      setTimeout(() => setNotifSaved(null), 2500);
    }
  };

  const getConnectionStatus = (integrationId: string) => {
    const keyMap: Record<string, string> = {
      trendaryo: "trendaryo",
      openrouter: "openrouter",
      suppliers: "cj",
      research: "meta",
    };
    const statusKey = keyMap[integrationId];
    const connected = statusKey && integrationStatus[statusKey];

    if (integrationId === "suppliers") {
      const anySupplier =
        integrationStatus.cj ||
        integrationStatus.zendrop ||
        integrationStatus.aliexpress ||
        integrationStatus.openrouter;
      if (anySupplier) {
        return { status: "Connected", color: "bg-emerald-500/20 text-emerald-300" };
      }
    }

    if (connected) {
      return { status: "Connected", color: "bg-emerald-500/20 text-emerald-300" };
    }
    return { status: "Not connected", color: "bg-zinc-800 text-zinc-400" };
  };

  async function handleAddCustomApi() {
    if (!addApiForm.name.trim() || !addApiForm.url.trim()) {
      return;
    }
    setAddApiSaving(true);
    const newApi = { id: Date.now().toString(), ...addApiForm };
    const updated = [...customApis, newApi];
    localStorage.setItem("custom_apis", JSON.stringify(updated));
    setCustomApis(updated);
    setShowAddApi(false);
    setAddApiForm({ name: "", url: "", key: "" });
    setAddApiSaving(false);
  }

  function handleDeleteCustomApi(id: string) {
    const updated = customApis.filter((a) => a.id !== id);
    localStorage.setItem("custom_apis", JSON.stringify(updated));
    setCustomApis(updated);
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-50">Settings</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Manage API keys and integrations for your automation workflows.{" "}
          <a href="/schedules" className="text-emerald-400 hover:text-emerald-300">
            Scheduled scans →
          </a>
        </p>
      </header>

      {integrations.map((integration) => {
        const connectionStatus = getConnectionStatus(integration.id);
        const isSaving = saving[integration.id];
        const saveStatus = savedStatus[integration.id];

        async function handleAddCustomApi() {
    if (!addApiForm.name.trim() || !addApiForm.url.trim()) {
      return;
    }
    setAddApiSaving(true);
    const newApi = { id: Date.now().toString(), ...addApiForm };
    const updated = [...customApis, newApi];
    localStorage.setItem("custom_apis", JSON.stringify(updated));
    setCustomApis(updated);
    setShowAddApi(false);
    setAddApiForm({ name: "", url: "", key: "" });
    setAddApiSaving(false);
  }

  function handleDeleteCustomApi(id: string) {
    const updated = customApis.filter((a) => a.id !== id);
    localStorage.setItem("custom_apis", JSON.stringify(updated));
    setCustomApis(updated);
  }

  return (
          <section
            key={integration.id}
            className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{integration.icon}</span>
                <div>
                  <h2 className="font-medium text-zinc-200">{integration.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">{integration.description}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs ${connectionStatus.color}`}
              >
                {connectionStatus.status}
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {integration.fields.map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="flex items-center justify-between">
                    <span className="text-sm text-zinc-300">
                      {field.label}
                      {field.required && <span className="text-red-400">*</span>}
                    </span>
                    {field.type === "password" && (
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility(field.id)}
                        className="text-xs text-zinc-500 hover:text-zinc-300"
                      >
                        {showPassword[field.id] ? "Hide" : "Show"}
                      </button>
                    )}
                  </label>
                  <input
                    type={field.type === "password" && !showPassword[field.id] ? "password" : field.type}
                    placeholder={field.placeholder}
                    value={apiKeys[field.id] || ""}
                    onChange={(e) =>
                      setApiKeys((prev) => ({ ...prev, [field.id]: e.target.value }))
                    }
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-xs text-zinc-500">{field.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-xs text-zinc-500">
                {saveStatus === "saved" ? (
                  <span className="text-emerald-400">✓ Saved successfully</span>
                ) : saveStatus === "error" ? (
                  <span className="text-red-400">✕ Failed to save</span>
                ) : (
                  "Changes will be saved securely"
                )}
              </p>
              <button
                onClick={() => handleSave(integration.id)}
                disabled={isSaving}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>
        );
      })}

      {/* Custom APIs section */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🔑</span>
            <div>
              <h2 className="font-medium text-zinc-200">Custom API Integrations</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Add third-party or custom API endpoints for your automations.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowAddApi(true)}
            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-zinc-950 hover:bg-emerald-400"
          >
            + Add API
          </button>
        </div>

        {customApis.length > 0 ? (
          <div className="mt-4 space-y-2">
            {customApis.map((api) => (
              <div key={api.id} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-3">
                <div>
                  <p className="text-sm text-zinc-200 font-medium">{api.name}</p>
                  <p className="text-xs text-zinc-500 truncate max-w-xs">{api.url}</p>
                </div>
                <button
                  onClick={() => handleDeleteCustomApi(api.id)}
                  className="text-xs text-red-400 hover:text-red-300 ml-4"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-xs text-zinc-600">No custom APIs added yet.</p>
        )}
      </section>

      {/* Add API modal */}
      {showAddApi && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="text-lg font-medium text-zinc-50">Add Custom API</h3>
              <p className="mt-1 text-sm text-zinc-400">Add a custom API endpoint for use in automations.</p>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-zinc-400 mb-1">API Name <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  placeholder="My Custom API"
                  value={addApiForm.name}
                  onChange={(e) => setAddApiForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">Base URL <span className="text-red-400">*</span></label>
                <input
                  type="url"
                  placeholder="https://api.example.com"
                  value={addApiForm.url}
                  onChange={(e) => setAddApiForm((p) => ({ ...p, url: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1">API Key</label>
                <input
                  type="password"
                  placeholder="Bearer token or API key"
                  value={addApiForm.key}
                  onChange={(e) => setAddApiForm((p) => ({ ...p, key: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
              <button
                onClick={() => { setShowAddApi(false); setAddApiForm({ name: "", url: "", key: "" }); }}
                className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomApi}
                disabled={addApiSaving || !addApiForm.name.trim() || !addApiForm.url.trim()}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
              >
                {addApiSaving ? "Adding..." : "Add API"}
              </button>
            </div>
          </div>
        </div>
      )}

      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 text-sm text-zinc-400">
        <h2 className="font-medium text-zinc-200">Security Note</h2>
        <p className="mt-2">
          API keys are encrypted and stored securely. Never share your API keys with anyone.
        </p>
      </section>

      {/* NEW: Notifications section (previously missing UI) */}
      <section className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔔</span>
          <div>
            <h2 className="font-medium text-zinc-200">Notifications</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Get alerts for automation results, order updates, and scheduled scans via Slack or email.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={notifPrefs.email}
              onChange={(e) => setNotifPrefs((p) => ({ ...p, email: e.target.checked }))}
              className="accent-emerald-500"
            />
            Email notifications (powered by Resend — configure RESEND_API_KEY in .env.local)
          </label>

          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={notifPrefs.slack}
              onChange={(e) => setNotifPrefs((p) => ({ ...p, slack: e.target.checked }))}
              className="accent-emerald-500"
            />
            Slack notifications
          </label>

          <div>
            <span className="block text-sm text-zinc-300 mb-1">Slack Webhook URL</span>
            <input
              type="url"
              placeholder="https://hooks.slack.com/services/..."
              value={notifPrefs.slackWebhook}
              onChange={(e) => setNotifPrefs((p) => ({ ...p, slackWebhook: e.target.value }))}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-emerald-500 focus:outline-none"
            />
            <p className="text-xs text-zinc-500 mt-1">Create an Incoming Webhook in your Slack workspace.</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            {notifSaved === "saved" ? <span className="text-emerald-400">✓ Saved</span> : notifSaved === "error" ? <span className="text-red-400">✕ Error</span> : "Notifications use your saved prefs"}
          </p>
          <button
            onClick={handleSaveNotifications}
            disabled={notifSaving}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {notifSaving ? "Saving…" : "Save Notifications"}
          </button>
        </div>
      </section>
    </div>
  );
}
