export type SocialPlatform = "instagram" | "facebook" | "twitter" | "tiktok" | "pinterest"

export interface SocialPostPayload {
  platform: SocialPlatform
  caption: string
  imageUrl?: string
  hashtags: string[]
  callToAction: string
  scheduledAt: string
}

export interface SocialConnectionStatus {
  platform: SocialPlatform
  connected: boolean
  message: string
}

const mockConnections: SocialConnectionStatus[] = [
  { platform: "instagram", connected: true, message: "Connected via OAuth" },
  { platform: "facebook", connected: false, message: "Not connected" },
  { platform: "twitter", connected: false, message: "Mock connection only" },
  { platform: "tiktok", connected: false, message: "Requires API key" },
  { platform: "pinterest", connected: false, message: "Coming soon" },
]

export async function getSocialConnections(): Promise<SocialConnectionStatus[]> {
  return new Promise((resolve) => setTimeout(() => resolve([...mockConnections]), 200))
}

export async function scheduleSocialPost(payload: SocialPostPayload): Promise<{ success: boolean; message: string }> {
  console.log("Scheduling social post", payload)
  return new Promise((resolve) =>
    setTimeout(() => resolve({ success: true, message: `Scheduled ${payload.platform} post for ${payload.scheduledAt}` }), 400)
  )
}

export async function connectSocialPlatform(platform: SocialPlatform): Promise<SocialConnectionStatus> {
  const connection = mockConnections.find((item) => item.platform === platform)
  if (connection) {
    connection.connected = true
    connection.message = "Connection established (mock)"
  }
  return new Promise((resolve) => setTimeout(() => resolve(connection ?? { platform, connected: false, message: "Platform not available" }), 200))
}
