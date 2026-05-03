"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ComputerIcon, Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useEffect, useState } from "react"

type ThemeMode = "system" | "light" | "dark"

const THEME_STORAGE_KEY = "cbc-theme"

const OPTIONS: Array<{ mode: ThemeMode; label: string; icon: typeof ComputerIcon }> = [
  { mode: "system", label: "Use system theme", icon: ComputerIcon },
  { mode: "light", label: "Use light theme", icon: Sun03Icon },
  { mode: "dark", label: "Use dark theme", icon: Moon02Icon },
]

function applyTheme(mode: ThemeMode) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  document.documentElement.classList.toggle("dark", mode === "dark" || (mode === "system" && prefersDark))
}

export function ThemeSwitcher({ className }: { className?: string }) {
  const [mode, setMode] = useState<ThemeMode>("system")

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null
    const initialMode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system"
    applyTheme(initialMode)
    queueMicrotask(() => setMode(initialMode))

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleSystemChange = () => {
      if ((window.localStorage.getItem(THEME_STORAGE_KEY) ?? "system") === "system") {
        applyTheme("system")
      }
    }

    media.addEventListener("change", handleSystemChange)
    return () => media.removeEventListener("change", handleSystemChange)
  }, [])

  const updateTheme = (nextMode: ThemeMode) => {
    setMode(nextMode)
    window.localStorage.setItem(THEME_STORAGE_KEY, nextMode)
    applyTheme(nextMode)
  }

  return (
    <div className={cn("inline-flex items-center rounded-full border border-border bg-muted p-1 dark:border-border dark:bg-muted", className)}>
      {OPTIONS.map((option) => (
        <Button
          key={option.mode}
          type="button"
          variant="ghost"
          size="icon"
          aria-label={option.label}
          title={option.label}
          aria-pressed={mode === option.mode}
          onClick={() => updateTheme(option.mode)}
          className={cn(
            "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground dark:text-muted-foreground/80 dark:hover:text-foreground",
            mode === option.mode && "bg-card text-blue-600 shadow-sm dark:bg-card dark:text-blue-300",
          )}
        >
          <HugeiconsIcon icon={option.icon} size={17} />
        </Button>
      ))}
    </div>
  )
}
