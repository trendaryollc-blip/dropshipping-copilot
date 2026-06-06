"use client"

import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
        <Sun className="size-4" />
      </Button>
    )
  }

  // Cycle through: dark → light → system → dark
  const cycleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else if (theme === "light") {
      setTheme("system")
    } else {
      setTheme("dark")
    }
  }

  const getIcon = () => {
    if (theme === "dark") return <Sun className="size-4" />
    if (theme === "light") return <Moon className="size-4" />
    return <Monitor className="size-4" />
  }

  const getLabel = () => {
    if (theme === "dark") return "Switch to light mode"
    if (theme === "light") return "Switch to system preference"
    return "Switch to dark mode"
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-muted-foreground hover:text-foreground"
      onClick={cycleTheme}
      title={getLabel()}
    >
      {getIcon()}
    </Button>
  )
}