import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Fragment } from "react"

export interface Crumb {
  label: string
  href?: string
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm">
      {items.map((item, i) => {
        const last = i === items.length - 1
        return (
          <Fragment key={item.label}>
            {item.href && !last ? (
              <Link
                href={item.href}
                className="font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  last ? "font-semibold text-primary" : "text-muted-foreground"
                }
              >
                {item.label}
              </span>
            )}
            {!last && (
              <ChevronRight className="size-4 shrink-0 text-muted-foreground/60" />
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}
