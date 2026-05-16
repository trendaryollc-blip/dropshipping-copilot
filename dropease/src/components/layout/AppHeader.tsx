"use client"

import { Search, LogIn, LogOut } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { NotificationsPopover } from "@/components/notifications-popover"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuthStore } from "@/store/useAuthStore"
import { toast } from "sonner"
import Link from "next/link"

export function AppHeader() {
  const { user, isAuthenticated, logout } = useAuthStore()

  function handleLogout() {
    logout()
    toast.success("Signed out successfully")
  }

  const displayName = user?.name ?? "Drop Shipper"
  const displayEmail = user?.email ?? "beginner@dropease.com"
  const avatarSrc = user?.avatar ?? "https://i.pravatar.cc/32?u=dropease-user"
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur-sm">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="flex flex-1 items-center gap-3">
        <div className="relative hidden max-w-xs flex-1 sm:flex">
          <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, suppliers..."
            className="h-8 pl-8 text-sm bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <NotificationsPopover />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 w-8 rounded-full p-0 ml-0.5">
                <Avatar className="size-7">
                  <AvatarImage src={avatarSrc} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">{displayName}</p>
                <p className="text-xs text-muted-foreground">{displayEmail}</p>
                {user?.plan && (
                  <span className="mt-1 inline-flex w-fit items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary capitalize">
                    {user.plan} plan
                  </span>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              render={
                <Link href="/auth/login">Profile</Link>
              }
            />
            <DropdownMenuSeparator />
            {isAuthenticated ? (
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
                <LogOut className="size-3.5 mr-2" /> Sign Out
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                render={
                  <Link href="/auth/login" className="flex items-center gap-2">
                    <LogIn className="size-3.5" /> Sign In
                  </Link>
                }
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
