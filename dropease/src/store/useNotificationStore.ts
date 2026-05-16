"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Notification, NotificationType } from "@/types"

const initialNotifications: Notification[] = [
  {
    id: "n1",
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-1043 from Mike Johnson – $45.99",
    read: false,
    createdAt: new Date().toISOString(),
    href: "/orders",
  },
  {
    id: "n2",
    type: "product",
    title: "Product Trending",
    message: "Wireless Earbuds Pro trend score jumped to 94/100 🔥",
    read: false,
    createdAt: new Date(Date.now() - 3_600_000).toISOString(),
    href: "/products",
  },
  {
    id: "n3",
    type: "alert",
    title: "Price Alert",
    message: "Competitor dropped price by 15% on Phone Grip Stand",
    read: false,
    createdAt: new Date(Date.now() - 7_200_000).toISOString(),
    href: "/competitors",
  },
  {
    id: "n4",
    type: "supplier",
    title: "Supplier Verified",
    message: "EcoSupply has been verified with a 4.9 trust score",
    read: true,
    createdAt: new Date(Date.now() - 86_400_000).toISOString(),
    href: "/suppliers",
  },
  {
    id: "n5",
    type: "system",
    title: "Welcome to DropEase!",
    message: "Complete your profile to get personalized recommendations",
    read: true,
    createdAt: new Date(Date.now() - 172_800_000).toISOString(),
  },
]

interface NotificationState {
  notifications: Notification[]
  addNotification: (n: Omit<Notification, "id" | "createdAt" | "read">) => void
  markRead: (id: string) => void
  markAllRead: () => void
  remove: (id: string) => void
  clearAll: () => void
  unreadCount: () => number
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: initialNotifications,

      addNotification: (n) =>
        set((state) => ({
          notifications: [
            {
              ...n,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
        })),

      markRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      remove: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),

      clearAll: () => set({ notifications: [] }),

      unreadCount: () => get().notifications.filter((n) => !n.read).length,
    }),
    { name: "dropease-notifications" }
  )
)
