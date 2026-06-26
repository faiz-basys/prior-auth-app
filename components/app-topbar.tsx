"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Bell, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const tabs = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Worklist", href: "/" },
  { label: "Archive", href: "/archive" },
]

export function AppTopbar() {
  const pathname = usePathname()
  const isWorklist = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/requests") : pathname === href

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
      <span className="text-base font-bold text-foreground">Review Portal</span>

      <div className="relative hidden max-w-xs flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder="Search case ID..."
          aria-label="Search case ID"
          className="h-10 w-full rounded-full border border-border bg-secondary/60 pl-9 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </div>

      <nav className="ml-auto hidden items-center gap-6 md:flex">
        {tabs.map((tab) => {
          const active = isWorklist(tab.href)
          return (
            <Link
              key={tab.label}
              href={tab.href}
              className={cn(
                "relative py-1 text-sm font-medium transition-colors",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {active && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-primary" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="ml-auto flex items-center gap-2 md:ml-0">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle className="size-5 text-muted-foreground" />
        </Button>
        <Button className="ml-1">Create Request</Button>
        <div className="ml-2 hidden items-center gap-2 border-l border-border pl-3 lg:flex">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
            KH
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-foreground">Karen Highland</p>
            <p className="text-xs text-muted-foreground">Senior Reviewer</p>
          </div>
        </div>
      </div>
    </header>
  )
}
