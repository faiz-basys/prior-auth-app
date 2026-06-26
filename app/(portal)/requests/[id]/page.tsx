import Link from "next/link"
import { notFound } from "next/navigation"
import {
  XCircle,
  CheckCircle2,
  Circle,
  Pencil,
  FileText,
  ImageIcon,
  BarChart3,
  Eye,
  ExternalLink,
  Plus,
  Info,
  Network,
  GitCompare,
  ArrowUpRight,
} from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { StatusBadge } from "@/components/status-badge"
import { Button } from "@/components/ui/button"
import { getRequest, type EvidenceDoc } from "@/lib/data"

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const req = getRequest(id)
  if (!req) notFound()

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumb
        items={[
          { label: "Worklist", href: "/" },
          { label: `Request #${req.caseId}` },
        ]}
      />

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Prior Authorization: {req.procedure}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">Submitted: {req.submitted}</p>
      </div>

      {/* Page tabs */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Request Detail
        </span>
        {/* <Link
          href={`/requests/${req.id}/clinical-logic`}
          className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Clinical Logic / Decision Tree
        </Link> */}
        <Link
          href={`/requests/${req.id}/compare`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <GitCompare className="size-4" />
          Compare Appeal
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
        {/* Main column */}
        <div className="flex flex-col gap-6">
          <RecommendationCard req={req} />
          <RationaleCard req={req} />
          {req.appeal && <AppealCard req={req} />}
        </div>

        {/* Sidebar column */}
        <div className="flex flex-col gap-6">
          <StatusCard req={req} />
          <PolicyContextCard req={req} />
          <EvidenceCard req={req} />
        </div>
      </div>
    </div>
  )
}

function RecommendationCard({ req }: { req: NonNullable<ReturnType<typeof getRequest>> }) {
  const denied = req.recommendationVerdict !== "APPROVED"
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div
        className={`border-l-4 p-5 ${denied ? "border-l-destructive" : "border-l-success"}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                  denied
                    ? "bg-destructive/10 text-destructive"
                    : "bg-success/12 text-success"
                }`}
              >
                {req.recommendationVerdict}
              </span>
              <span className="text-xs text-muted-foreground">
                Auto-Review Engine v4.2
              </span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-foreground">
              Basys Recommendation
            </h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {req.recommendation}
            </p>
          </div>
          <div className="text-right">
            <p
              className={`text-3xl font-bold ${denied ? "text-destructive" : "text-success"}`}
            >
              {req.confidence}%
            </p>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Confidence Score
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-3">
          {req.checks.map((check) => (
            <div key={check.label} className="flex items-center gap-2">
              {check.passed === false ? (
                <XCircle className="size-5 shrink-0 text-destructive" />
              ) : check.passed ? (
                <CheckCircle2 className="size-5 shrink-0 text-success" />
              ) : (
                <Circle className="size-5 shrink-0 text-muted-foreground" />
              )}
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">
                  {check.label}
                </p>
                <p
                  className={`text-xs ${
                    check.passed === false
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {check.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RationaleCard({ req }: { req: NonNullable<ReturnType<typeof getRequest>> }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">Decision Rationale</h2>
        <button className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          <Pencil className="size-3.5" />
          Edit Rationale
        </button>
      </div>

      <ol className="mt-4 flex flex-col">
        {req.rationale.map((item, i) => (
          <li key={item.title} className="relative flex gap-4 pb-6 last:pb-0">
            {i < req.rationale.length - 1 && (
              <span className="absolute left-[15px] top-9 h-[calc(100%-1.5rem)] w-px bg-border" />
            )}
            <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {i + 1}
            </span>
            <div className="min-w-0 pt-1">
              <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {item.detail}
              </p>
              {item.reference && (
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                  <FileText className="size-3.5" />
                  Referenced: {item.reference}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

function AppealCard({ req }: { req: NonNullable<ReturnType<typeof getRequest>> }) {
  const appeal = req.appeal!
  return (
    <section className="rounded-xl border border-success/30 bg-success/[0.04] p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ArrowUpRight className="size-5 text-success" />
          <h2 className="text-lg font-bold text-foreground">Appeal Request</h2>
        </div>
        <StatusBadge status={appeal.decision} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoLine label="Appellate Reviewer" value={appeal.reviewer} />
        <InfoLine label="Review Date" value={appeal.reviewDate} />
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Appeal Recommendation
      </p>
      <p className="mt-1 text-sm font-semibold text-success">
        {appeal.recommendation}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {appeal.rationale}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Link
          href={`/requests/${req.id}/compare`}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <GitCompare className="size-4" />
          Compare PA vs Appeal
        </Link>
        <Link
          href={`/requests/${req.id}/clinical-logic`}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          <Network className="size-4" />
          View Decision Tree
        </Link>
      </div>
    </section>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function StatusCard({ req }: { req: NonNullable<ReturnType<typeof getRequest>> }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Current Status
      </h2>
      <div className="mt-3 rounded-lg border border-warning/30 bg-warning/10 p-3">
        <div className="flex items-center gap-2">
          <Info className="size-4 text-warning" />
          <span className="text-sm font-bold text-foreground">{req.status}</span>
        </div>
        <p className="mt-0.5 pl-6 text-xs text-muted-foreground">
          Last updated · {req.lastUpdated}
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <Button className="w-full">Send Info Request</Button>
        <Button variant="outline" className="w-full">
          Route to Peer Review
        </Button>
      </div>
    </section>
  )
}

function PolicyContextCard({ req }: { req: NonNullable<ReturnType<typeof getRequest>> }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Policy Context
      </h2>

      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Policy Codes
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {req.policyCodes.map((code) => (
          <span
            key={code}
            className="rounded-md bg-primary/10 px-2 py-1 font-mono text-xs font-medium text-primary"
          >
            {code}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Policy File
      </p>
      <button className="mt-2 flex w-full items-center justify-between rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-left transition-colors hover:bg-secondary">
        <span className="flex items-center gap-2 text-sm font-medium text-foreground">
          <FileText className="size-4 text-destructive" />
          {req.policyFile}
        </span>
        <ExternalLink className="size-4 text-muted-foreground" />
      </button>
    </section>
  )
}

const evidenceIcon: Record<EvidenceDoc["type"], typeof FileText> = {
  image: ImageIcon,
  pdf: FileText,
  lab: BarChart3,
}

function EvidenceCard({ req }: { req: NonNullable<ReturnType<typeof getRequest>> }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="flex items-center justify-between px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Clinical Evidence ({req.evidence.length})
        </h2>
        <button
          aria-label="Add evidence"
          className="flex size-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>
      </header>
      <ul className="divide-y divide-border">
        {req.evidence.map((doc) => {
          const Icon = evidenceIcon[doc.type]
          return (
            <li
              key={doc.name}
              className="flex items-center justify-between gap-3 px-5 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Icon className="size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Added {doc.added} · {doc.size}
                  </p>
                </div>
              </div>
              <button
                aria-label={`View ${doc.name}`}
                className="flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <Eye className="size-4" />
              </button>
            </li>
          )
        })}
      </ul>
      <div className="border-t border-border bg-secondary/30 px-5 py-3 text-center">
        <button className="text-sm font-semibold text-primary hover:underline">
          View All Documents
        </button>
      </div>
    </section>
  )
}
