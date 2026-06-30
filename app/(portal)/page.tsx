import Link from "next/link"
import { ArrowRight, ClipboardList } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { StatusBadge } from "@/components/status-badge"
import { appeals, type RequestStatus } from "@/lib/data"

function countByStatus(statuses: RequestStatus[]) {
  return appeals.filter((a) => statuses.includes(a.status)).length
}

export default function DashboardPage() {
  const total = appeals.length
  const pending = countByStatus(["Pending", "In Review", "Missing Info"])
  const approved = countByStatus(["Approved"])
  const denied = countByStatus(["Denied"])
  const recent = appeals.slice(0, 5)

  return (
    <div className="w-full">
      <Breadcrumb items={[{ label: "Dashboard" }]} />

      <div className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Overview of active appeals and review activity.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Appeals" value={total} />
        <StatCard label="Pending Review" value={pending} />
        <StatCard label="Approved" value={approved} variant="success" />
        <StatCard label="Denied" value={denied} variant="destructive" />
      </div>

      <section className="mt-6 rounded-xl border border-border bg-card shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="size-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Recent Appeals
            </h2>
          </div>
          <Link
            href="/appeals"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            View all appeals
            <ArrowRight className="size-4" />
          </Link>
        </header>

        <ul className="divide-y divide-border">
          {recent.map((appeal) => (
            <li
              key={appeal.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-muted/40"
            >
              <div className="min-w-0">
                <Link
                  href={`/appeals/${appeal.id}/timeline`}
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {appeal.procedure}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {appeal.caseId} · {appeal.payerName}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <StatusBadge status={appeal.status} />
                <span className="text-sm text-muted-foreground">
                  {appeal.lastUpdated}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  variant,
}: {
  label: string
  value: number
  variant?: "success" | "destructive"
}) {
  const valueColor =
    variant === "success"
      ? "text-success"
      : variant === "destructive"
        ? "text-destructive"
        : "text-foreground"

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={`mt-2 text-3xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}
