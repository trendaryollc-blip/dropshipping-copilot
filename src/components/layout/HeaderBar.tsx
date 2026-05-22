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
     <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
       <div className="mx-auto flex max-w-[1800px] items-center gap-4 px-4 py-3 lg:px-6">
         <div className="flex items-center gap-2">
           <SidebarTrigger className="rounded-xl border border-border bg-accent p-2 transition hover:border-primary/30 hover:text-primary" />
           <div className="hidden min-w-[240px] items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 shadow-md sm:flex">
             <Search className="size-4 text-primary" />
             <Input
               value={query}
               onChange={(event) => setQuery(event.target.value)}
               placeholder="Search products, suppliers, orders..."
               className="h-10 border-0 bg-transparent px-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0"
             />
           </div>
         </div>

         <div className="hidden flex-1 md:block" />

         <div className="flex flex-1 items-center justify-end gap-3">
           <div className="hidden items-center gap-3 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground md:flex">
             <span className="text-primary">Live</span>
             <span className="rounded-full bg-accent px-2 py-1 text-xs uppercase tracking-[0.2em]">Realtime sync</span>
           </div>

           <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-2 shadow-md">
             <LocaleSwitcher />
             <ThemeToggle />
             <NotificationsPopover />
           </div>

           <DropdownMenu>
             <DropdownMenuTrigger
               render={
                 <Button variant="ghost" className="flex items-center gap-3 rounded-full border border-border bg-card px-2 py-1 text-sm shadow-sm">
                   <Avatar className="size-9">
                     <AvatarImage src={user?.avatar ?? "https://i.pravatar.cc/32?u=dropease-user"} />
                     <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
                   </Avatar>
                   <span className="hidden sm:block text-left">
                     <span className="block text-sm font-semibold">{displayName}</span>
                     <span className="block text-[11px] text-muted-foreground">{displayEmail}</span>
                   </span>
                   <ChevronDown className="size-4 text-muted-foreground" />
                 </Button>
               }
             />
             <DropdownMenuContent align="end" className="w-56 rounded-xl border border-border bg-card shadow-xl">
               <DropdownMenuLabel className="font-medium text-muted-foreground">
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
