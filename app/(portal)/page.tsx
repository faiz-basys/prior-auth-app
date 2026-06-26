import Link from "next/link"
import { ChevronRight, Trash2, Network } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { StatusBadge } from "@/components/status-badge"
import { requests } from "@/lib/data"

export default function PriorAuthListPage() {
  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Prior-Auth-Requests", href: "/" },
          { label: "Worklist" },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Prior Authorization Requests
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Review, compare, and finalize determinations across active cases.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{requests.length}</span>{" "}
          active requests
        </div>
      </div>

      {/* Requests table card */}
      <section className="mt-6 rounded-xl border border-border bg-card shadow-sm">
        <header className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold text-foreground">
            Prior Authorization Policies
          </h2>
        </header>

        {/* Table header (desktop) */}
        <div className="hidden grid-cols-12 gap-4 border-b border-border px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
          <div className="col-span-5">Policy Name</div>
          <div className="col-span-2">Payer Name</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Last Updated</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <ul className="divide-y divide-border">
          {requests.map((req) => (
            <li
              key={req.id}
              className="grid grid-cols-1 gap-3 px-5 py-4 transition-colors hover:bg-muted/40 md:grid-cols-12 md:items-center md:gap-4"
            >
              <div className="md:col-span-5">
                <Link
                  href={`/requests/${req.id}`}
                  className="font-semibold text-primary underline-offset-2 hover:underline"
                >
                  {req.procedure}
                </Link>
                <p className="text-xs text-muted-foreground">
                  {req.caseId} · {req.procedureCode}
                </p>
              </div>
              <div className="text-sm text-foreground md:col-span-2">
                {req.payerName}
              </div>
              <div className="md:col-span-2">
                <StatusBadge status={req.status} />
                {req.appealOutcomeLabel && (
                  <p className="mt-1 text-xs font-medium text-muted-foreground">
                    {req.appealOutcomeLabel}
                  </p>
                )}
              </div>
              <div className="text-sm text-muted-foreground md:col-span-2">
                {req.lastUpdated}
              </div>
              <div className="flex items-center gap-1 md:col-span-1 md:justify-end">
                <button
                  type="button"
                  aria-label="Delete request"
                  className="flex size-8 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </button>
                <Link
                  href={`/requests/${req.id}${req.appeal ? "/compare" : ""}`}
                  aria-label="Open request"
                  className="flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Detail cards for the first (focused) request */}
      <FocusedRequestCards />
    </div>
  )
}

function FocusedRequestCards() {
  const req = requests[0]
  return (
    <section className="mt-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <DetailCard title="Patient Details" name={req.patient.name}>
          <Field label="Email" value={req.patient.email} />
          <Field label="Address" value={req.patient.address} />
        </DetailCard>
        <DetailCard title="Reviewer Details" name={req.reviewer.org}>
          <Field label="Email" value={req.reviewer.email} />
          <Field label="Reviewer" value={req.reviewer.name} />
        </DetailCard>
        <DetailCard title="Provider Details" name={req.provider.name}>
          <Field label="Email" value={req.provider.email} />
          <Field label="NPI" value={req.provider.npi} />
        </DetailCard>
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href={`/requests/${req.id}/compare`}
          className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          <Network className="size-4" />
          View Appeal &amp; Decision Tree
        </Link>
      </div>
    </section>
  )
}

function DetailCard({
  title,
  name,
  children,
}: {
  title: string
  name: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-base font-bold text-foreground">{name}</p>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm text-muted-foreground">
      {label}: <span className="text-foreground/80">{value}</span>
    </p>
  )
}
