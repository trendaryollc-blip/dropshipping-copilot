"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { ChevronDown, Search } from "lucide-react"
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
import { LocaleSwitcher } from "@/components/locale-switcher"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"

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
    <header className="sticky top-0 z-40 border-b border-border/50 glass-strong">
      <div className="mx-auto flex max-w-[1800px] items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-5 lg:px-6">
        {/* Left: Sidebar trigger + Search */}
        <div className="flex items-center gap-2.5">
          <SidebarTrigger className="rounded-xl border border-border/50 bg-card/50 p-2 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary" />
          <div className="hidden min-w-[240px] items-center gap-3 rounded-2xl border border-border/50 bg-card/30 px-3.5 py-2 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card/50 focus-within:border-primary/30 focus-within:bg-card/60 sm:flex">
            <Search className="size-4 text-primary/60" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search anything..."
              className="h-8 border-0 bg-transparent px-0 text-sm placeholder:text-muted-foreground/60 focus-visible:ring-0"
            />
            <kbd className="hidden rounded-lg border border-border/50 bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60 lg:inline">⌘K</kbd>
          </div>
        </div>

        {/* Center spacer */}
        <div className="hidden flex-1 md:block" />

        {/* Right: Actions + Profile */}
        <div className="flex items-center gap-2">
          {/* Status indicator */}
          <div className="hidden items-center gap-2 rounded-2xl border border-border/30 bg-card/30 px-3 py-1.5 text-xs backdrop-blur-sm md:flex">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400">Live</span>
          </div>

          {/* Utility icons */}
          <div className="flex items-center gap-1 rounded-2xl border border-border/30 bg-card/30 p-1 backdrop-blur-sm">
            <LocaleSwitcher />
            <ThemeToggle />
            <NotificationsPopover />
          </div>

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="flex items-center gap-2.5 rounded-2xl border border-border/30 bg-card/30 px-2 py-1.5 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:bg-card/50">
                  <Avatar className="size-8 ring-2 ring-primary/10 ring-offset-1 ring-offset-background transition-all duration-300 group-hover:ring-primary/30">
                    <AvatarImage src={user?.avatar ?? "https://i.pravatar.cc/32?u=dropease-user"} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary-medium text-xs text-primary-foreground">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="hidden text-left sm:block">
                    <span className="block text-sm font-semibold leading-tight">{displayName}</span>
                    <span className="block text-[10px] text-muted-foreground">{displayEmail}</span>
                  </span>
                  <ChevronDown className="size-3.5 text-muted-foreground/60" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-52 rounded-2xl border-border/50 glass-strong p-1.5">
              <DropdownMenuLabel className="px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1 bg-border/50" />
              <DropdownMenuItem render={<Link href="/auth/login" />} className="cursor-pointer rounded-xl px-2.5 py-2 text-sm">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/settings" />} className="cursor-pointer rounded-xl px-2.5 py-2 text-sm">
                Preferences
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 bg-border/50" />
              {isAuthenticated ? (
                <DropdownMenuItem className="cursor-pointer rounded-xl px-2.5 py-2 text-sm text-destructive focus:text-destructive" onClick={handleLogout}>
                  Sign Out
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem render={<Link href="/auth/login" />} className="cursor-pointer rounded-xl px-2.5 py-2 text-sm">
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