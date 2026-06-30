import Link from "next/link"
import { ChevronRight, Trash2 } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { StatusBadge } from "@/components/status-badge"
import { appeals } from "@/lib/data"

export default function AppealsListPage() {
  return (
    <div className="w-full">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Appeals" },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Appeal Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, compare, and finalize determinations across active cases.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{appeals.length}</span>{" "}
          active appeals
        </div>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card shadow-sm">
        <header className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            Active Appeals
          </h2>
        </header>

        <div className="hidden grid-cols-12 gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
          <div className="col-span-5">Policy Name</div>
          <div className="col-span-2">Payer Name</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Last Updated</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <ul className="divide-y divide-border">
          {appeals.map((appeal) => (
            <li
              key={appeal.id}
              className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/40 md:grid-cols-12 md:items-center md:gap-4"
            >
              <div className="md:col-span-5">
                <Link
                  href={`/appeals/${appeal.id}/timeline`}
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {appeal.procedure}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {appeal.caseId} · {appeal.procedureCode}
                </p>
              </div>
              <div className="text-sm text-foreground md:col-span-2">
                {appeal.payerName}
              </div>
              <div className="md:col-span-2">
                <StatusBadge status={appeal.status} />
                {appeal.appealOutcomeLabel && (
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {appeal.appealOutcomeLabel}
                  </p>
                )}
              </div>
              <div className="text-sm text-muted-foreground md:col-span-2">
                {appeal.lastUpdated}
              </div>
              <div className="flex items-center gap-1 md:col-span-1 md:justify-end">
                <button
                  type="button"
                  aria-label="Delete appeal"
                  className="flex size-8 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </button>
                <Link
                  href={`/appeals/${appeal.id}/timeline`}
                  aria-label="Open appeal timeline"
                  className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
