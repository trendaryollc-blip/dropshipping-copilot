"use client"

import { useState } from "react"
import { Bell, Check, CheckCheck, Package, ShoppingCart, Users, AlertTriangle, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useNotificationStore } from "@/store/useNotificationStore"
import { cn } from "@/lib/utils"
import type { NotificationType } from "@/types"
import Link from "next/link"

const typeConfig: Record<NotificationType, { icon: React.ElementType; color: string }> = {
  order: { icon: ShoppingCart, color: "bg-blue-100 text-blue-600" },
  product: { icon: Package, color: "bg-emerald-100 text-primary" },
  supplier: { icon: Users, color: "bg-purple-100 text-purple-600" },
  alert: { icon: AlertTriangle, color: "bg-amber-100 text-amber-600" },
  system: { icon: Info, color: "bg-gray-100 text-gray-600" },
}

function timeAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export function NotificationsPopover() {
  const { notifications, markRead, markAllRead, remove, unreadCount } = useNotificationStore()
  const [open, setOpen] = useState(false)
  const count = unreadCount()

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
      >
        <Bell className="size-4" />
        {count > 0 && (
          <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-80 sm:w-96 p-0 gap-0">
        <SheetHeader className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base">Notifications</SheetTitle>
            {count > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs text-primary" onClick={markAllRead}>
                <CheckCheck className="size-3.5" /> Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center px-4">
              <Bell className="size-10 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">All caught up! No notifications.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {notifications.map((n) => {
                const { icon: Icon, color } = typeConfig[n.type]
                const Wrapper = n.href ? Link : "div"
                return (
                  <li
                    key={n.id}
                    className={cn("group relative flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/40", !n.read && "bg-primary/5")}
                  >
                    <Wrapper href={(n.href as string) ?? "#"} onClick={() => markRead(n.id)} className="flex flex-1 items-start gap-3 min-w-0">
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${color}`}>
                        <Icon className="size-3.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-xs leading-snug", !n.read ? "font-semibold text-foreground" : "text-foreground")}>{n.title}</p>
                          <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-muted-foreground leading-snug">{n.message}</p>
                      </div>
                    </Wrapper>

                    <div className="absolute right-2 top-2 hidden gap-1 group-hover:flex">
                      {!n.read && (
                        <button onClick={() => markRead(n.id)} className="rounded p-1 hover:bg-muted" title="Mark read">
                          <Check className="size-3 text-muted-foreground" />
                        </button>
                      )}
                      <button onClick={() => remove(n.id)} className="rounded p-1 hover:bg-muted" title="Remove">
                        <X className="size-3 text-muted-foreground" />
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
    </>
  )
}
