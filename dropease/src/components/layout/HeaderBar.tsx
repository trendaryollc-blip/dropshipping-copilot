"use client"

import { useMemo, useState } from "react"
import { Search, Bell, ChevronDown } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationsPopover } from "@/components/notifications-popover"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import Link from "next/link"

export function HeaderBar() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const [query, setQuery] = useState("")

  const displayName = user?.name ?? "Drop Shipper"
  const displayEmail = user?.email ?? "beginner@dropease.com"
  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .map((segment) => segment[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }, [displayName])

  const handleLogout = () => {
    logout()
    toast.success("Signed out successfully")
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1800px] items-center gap-4 px-4 py-3 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="rounded-2xl border border-white/10 bg-white/5 p-2 text-white transition hover:border-emerald-300/40 hover:text-emerald-200" />
          <div className="hidden min-w-[240px] items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/70 px-3 py-2 shadow-[0_20px_60px_-30px_rgba(0,255,186,0.25)] sm:flex">
            <Search className="size-4 text-emerald-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, suppliers, orders..."
              className="h-10 border-0 bg-transparent px-0 text-sm text-white placeholder:text-slate-500 focus-visible:ring-0"
            />
          </div>
        </div>

        <div className="hidden flex-1 md:block" />

        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="hidden items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/70 px-4 py-2 text-sm text-slate-300 md:flex">
            <span className="text-emerald-300">Live</span>
            <span className="rounded-full bg-white/10 px-2 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">Realtime sync</span>
          </div>

          <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-slate-900/70 px-2 py-2 text-white shadow-lg shadow-slate-950/20">
            <ThemeToggle />
            <NotificationsPopover />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/70 px-2 py-1 text-sm text-white shadow-sm shadow-black/20">
                  <Avatar className="size-9">
                    <AvatarImage src={user?.avatar ?? "https://i.pravatar.cc/32?u=dropease-user"} />
                    <AvatarFallback className="bg-emerald-500 text-black">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-left">
                    <span className="block text-sm font-semibold text-white">{displayName}</span>
                    <span className="block text-[11px] text-slate-400">{displayEmail}</span>
                  </span>
                  <ChevronDown className="size-4 text-slate-400" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56 rounded-3xl border border-white/10 bg-slate-950/95 text-white shadow-2xl shadow-black/20">
              <DropdownMenuLabel className="font-medium text-slate-300">
                Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/auth/login">Profile</Link>}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/settings">Preferences</Link>}>
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isAuthenticated ? (
                <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem render={<Link href="/auth/login">Sign In</Link>}>
                  Sign In
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
