"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutGrid,
  ClipboardList,
  Settings,
  LifeBuoy,
} from "lucide-react"
import { cn } from "@/lib/utils"

const nav = [
  { label: "Dashboard", href: "/", icon: LayoutGrid },
  { label: "Appeals", href: "/appeals", icon: ClipboardList },
]

export function AppSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="px-6 py-5">
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          FHP Admin
        </h1>
        <p className="text-xs text-muted-foreground">Clinical Review Portal</p>
      </div>

      <nav className="flex-1 px-3 py-2">
        <ul className="flex flex-col gap-1">
          {nav.map((item) => {
            const active = isActive(item.href)
            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50",
                  )}
                >
                  {active && (
                    <span className="absolute -left-3 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                  )}
                  <item.icon className="size-5 shrink-0" strokeWidth={2} />
                  <span className="text-balance">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-1 px-3 py-4">
        <Link
          href="/settings"
          className={cn(
            "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive("/settings")
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50",
          )}
        >
          {isActive("/settings") && (
            <span className="absolute -left-3 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
          )}
          <Settings className="size-5 shrink-0" />
          Settings
        </Link>
        <Link
          href="/support"
          className={cn(
            "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive("/support")
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent/50",
          )}
        >
          {isActive("/support") && (
            <span className="absolute -left-3 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
          )}
          <LifeBuoy className="size-5 shrink-0" />
          Support
        </Link>

        <div className="mt-3 flex items-center gap-3 border-t border-sidebar-border px-3 pt-4">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            KH
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              Karen Highland
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Reviewer ID: 4920
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
