"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Monitor } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const modes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const

export function AppearanceSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-base font-semibold text-card-foreground">Appearance</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Customize how the Review Portal looks on your device.
      </p>

      {/* Quick dark mode toggle */}
      <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-border bg-background px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">Dark mode</p>
            <p className="text-xs text-muted-foreground">
              {mounted
                ? isDark
                  ? "Dark theme is enabled"
                  : "Light theme is enabled"
                : "Loading theme preference"}
            </p>
          </div>
        </div>
        <Switch
          aria-label="Toggle dark mode"
          checked={isDark}
          disabled={!mounted}
          onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        />
      </div>

      {/* Explicit theme selection */}
      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-foreground">Theme preference</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {modes.map((mode) => {
            const active = mounted && theme === mode.value
            return (
              <button
                key={mode.value}
                type="button"
                onClick={() => setTheme(mode.value)}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors",
                  active
                    ? "border-primary bg-accent ring-1 ring-primary"
                    : "border-border bg-background hover:bg-accent/50",
                )}
              >
                <mode.icon
                  className={cn(
                    "size-5 shrink-0",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                />
                <span
                  className={cn(
                    "text-sm font-medium",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {mode.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
