export interface PushSubscriptionStatus {
  supported: boolean
  permission: NotificationPermission
  subscribed: boolean
}

export async function requestPushPermission(): Promise<PushSubscriptionStatus> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return { supported: false, permission: "denied", subscribed: false }
  }

  const permission = await Notification.requestPermission()
  return {
    supported: true,
    permission,
    subscribed: permission === "granted",
  }
}

export async function sendTestPushNotification(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator) || Notification.permission !== "granted") {
    return false
  }

  const registration = await navigator.serviceWorker.getRegistration()
  if (!registration) return false

  try {
    registration.showNotification("DropEase Test Notification", {
      body: "This is a sample push notification from DropEase.",
      icon: "/favicon.ico",
      tag: "dropease-test",
    })
    return true
  } catch (error) {
    console.error("Push notification failed", error)
    return false
  }
}
