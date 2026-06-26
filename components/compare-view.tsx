"use client"

import { useState } from "react"
import {
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  FileDown,
  CheckCircle,
  FileText,
  ImageIcon,
  BarChart3,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Criterion, DocChange, EvidenceDoc, PriorAuthRequest } from "@/lib/data"

type Mode = "overview" | "tree"

export function CompareView({ req }: { req: PriorAuthRequest }) {
  const [mode, setMode] = useState<Mode>("overview")
  const appeal = req.appeal!

  return (
    <div>
      {/* Header row with toggle */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            {mode === "overview"
              ? "Compare Results: Overview"
              : "Compare Decision Logic"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Cross-referencing initial denial with appeal evidence for final
            determination.
          </p>
        </div>

        <div className="flex rounded-lg border border-border bg-card p-1 shadow-sm">
          <ToggleButton active={mode === "overview"} onClick={() => setMode("overview")}>
            Overview Comparison
          </ToggleButton>
          <ToggleButton active={mode === "tree"} onClick={() => setMode("tree")}>
            Decision Tree Comparison
          </ToggleButton>
        </div>
      </div>

      {/* Patient summary strip */}
      <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-5 shadow-sm md:grid-cols-4">
        <SummaryItem label="Patient" value={`${req.patient.name} (${req.patient.age}Y, ${req.patient.sex})`} />
        <SummaryItem label="Procedure" value={`${req.procedure} (${req.procedureCode})`} />
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Original Decision
          </p>
          <span className="mt-1 inline-flex rounded-md bg-destructive/10 px-2 py-0.5 text-sm font-semibold text-destructive">
            Denied (Mar 12)
          </span>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Appeal Decision
          </p>
          <span className="mt-1 inline-flex rounded-md bg-success/12 px-2 py-0.5 text-sm font-semibold text-success">
            Approved ({appeal.decisionDate})
          </span>
        </div>
      </div>

      {mode === "overview" ? (
        <OverviewComparison req={req} />
      ) : (
        <TreeComparison req={req} />
      )}
    </div>
  )
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md px-4 py-2 text-sm font-semibold transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-foreground">{value}</p>
    </div>
  )
}

/* ---------------- Overview Comparison ---------------- */

function OverviewComparison({ req }: { req: PriorAuthRequest }) {
  const appeal = req.appeal!
  return (
    <>
      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Original */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Original Request</h2>
            <span className="rounded-md bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
              DENIED
            </span>
          </div>
          <article className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="p-5">
              <SectionLabel>Recommendation</SectionLabel>
              <p className="mt-1 text-base font-bold leading-snug text-destructive">
                Deny coverage based on Clinical Guideline: Lack of documented
                conservative therapy.
              </p>
              <SectionLabel className="mt-5">Rationale</SectionLabel>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {req.recommendation}
              </p>
              <div className="mt-5 space-y-3 border-t border-border pt-4">
                <KeyVal label="Review Date" value="Oct 12, 2023" />
              </div>
            </div>
            <DocList title="Patient Charts" docs={req.evidence} side="original" />
          </article>
        </div>

        {/* Appeal */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Appeal Request</h2>
            <span className="rounded-md bg-success/12 px-2.5 py-1 text-xs font-bold text-success">
              APPROVED
            </span>
          </div>
          <article className="overflow-hidden rounded-xl border border-l-4 border-l-primary border-border bg-card shadow-sm">
            <div className="p-5">
              <SectionLabel>Recommendation</SectionLabel>
              <p className="mt-1 text-base font-bold leading-snug text-primary">
                {appeal.recommendation}
              </p>
              <SectionLabel className="mt-5">Rationale</SectionLabel>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {appeal.rationale}
              </p>
              <div className="mt-5 space-y-3 border-t border-border pt-4">
                <KeyVal label="Review Date" value={appeal.reviewDate} />
              </div>
            </div>
            <DocList title="Appeal Documents" docs={appeal.evidence} side="appeal" />
          </article>
        </div>
      </div>

      {/* Summary + confidence */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_18rem]">
        <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Info className="size-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Review Summary &amp; Discrepancy
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                The primary discrepancy lies in the initial omission of Physical
                Therapy (PT) logs. The appeal successfully addressed this by
                providing a comprehensive medical record export. The clinical
                necessity is now clearly established through the newly verified
                documentation of failed conservative treatment and radiographic
                progression.
              </p>
            </div>
          </div>
        </article>

        {/* <article className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-5 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Final Confidence Score
          </p>
          <ConfidenceRing value={92} />
          <p className="text-sm font-semibold text-primary">High Assurance Level</p>
        </article> */}
      </div>

      <FooterActions />
    </>
  )
}

const docIcon: Record<EvidenceDoc["type"], typeof FileText> = {
  image: ImageIcon,
  pdf: FileText,
  lab: BarChart3,
}

const docChangeStyles: Record<
  DocChange,
  { row: string; badge: string; label: string }
> = {
  new: {
    row: "border-l-[3px] border-l-success bg-success/[0.06]",
    badge: "bg-success/12 text-success",
    label: "New",
  },
  updated: {
    row: "border-l-[3px] border-l-warning bg-warning/10",
    badge: "bg-warning/15 text-warning",
    label: "Updated",
  },
  insufficient: {
    row: "border-l-[3px] border-l-destructive bg-destructive/5",
    badge: "bg-destructive/10 text-destructive",
    label: "Gap",
  },
  unchanged: {
    row: "",
    badge: "bg-muted text-muted-foreground",
    label: "On File",
  },
}

function DocList({
  title,
  docs,
  side,
}: {
  title: string
  docs: EvidenceDoc[]
  side: "original" | "appeal"
}) {
  const [open, setOpen] = useState(false)
  const changedCount = docs.filter(
    (d) => d.change && d.change !== "unchanged",
  ).length

  return (
    <div className="border-t border-border bg-secondary/20">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-secondary/40"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {title} ({docs.length})
          </span>
          {changedCount > 0 && (
            <span
              className={cn(
                "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                side === "appeal"
                  ? "bg-success/12 text-success"
                  : "bg-destructive/10 text-destructive",
              )}
            >
              {side === "appeal"
                ? `${changedCount} new/updated`
                : `${changedCount} gap${changedCount > 1 ? "s" : ""}`}
            </span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <ul className="divide-y divide-border border-t border-border bg-card">
          {docs.map((doc) => {
            const Icon = docIcon[doc.type]
            const change = doc.change ?? "unchanged"
            const styles = docChangeStyles[change]
            return (
              <li
                key={doc.name}
                className={cn("px-5 py-3", styles.row)}
              >
                <div className="flex items-start gap-3">
                  <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-medium text-foreground">
                        {doc.name}
                      </p>
                      {doc.change && (
                        <span
                          className={cn(
                            "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                            styles.badge,
                          )}
                        >
                          {styles.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Added {doc.added} · {doc.size}
                    </p>
                    {doc.changeNote && (
                      <p
                        className={cn(
                          "mt-1 text-xs leading-relaxed",
                          change === "new" && "text-success",
                          change === "updated" && "text-warning",
                          change === "insufficient" && "text-destructive",
                          change === "unchanged" && "text-muted-foreground",
                        )}
                      >
                        {doc.changeNote}
                        {doc.relatedDoc && (
                          <span className="font-medium"> → {doc.relatedDoc}</span>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <p
      className={cn(
        "text-xs font-semibold uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  )
}

function KeyVal({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-bold text-foreground">{value}</span>
    </div>
  )
}

function ConfidenceRing({ value }: { value: number }) {
  const r = 42
  const c = 2 * Math.PI * r
  const offset = c - (value / 100) * c
  return (
    <div className="relative my-3 size-28">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--border)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-foreground">
        {value}%
      </span>
    </div>
  )
}

/* ---------------- Decision Tree Comparison ---------------- */

function flatten(criteria: Criterion[]): Criterion[] {
  return criteria.flatMap((c) => [c, ...(c.children ? flatten(c.children) : [])])
}

function TreeComparison({ req }: { req: PriorAuthRequest }) {
  const appeal = req.appeal!
  const originalMap = new Map(flatten(req.criteria).map((c) => [c.id, c]))

  return (
    <>
      <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-3">
            <h2 className="text-lg font-bold text-foreground">Original Determination</h2>
            <p className="text-xs text-muted-foreground">
              {req.policyRef} — {req.policyVersion}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            {req.criteria.map((c) => (
              <TreeNode key={c.id} criterion={c} variant="original" depth={0} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center gap-2">
            <h2 className="text-lg font-bold text-foreground">Appeal Determination</h2>
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3" />
              New Evidence
            </span>
          </div>
          <div className="rounded-xl border border-l-4 border-l-primary border-border bg-card p-4 shadow-sm">
            {appeal.criteria.map((c) => (
              <TreeNode
                key={c.id}
                criterion={c}
                variant="appeal"
                depth={0}
                originalMap={originalMap}
              />
            ))}
          </div>
        </div>
      </div>

      <FooterActions />
    </>
  )
}

function TreeNode({
  criterion,
  variant,
  depth,
  originalMap,
  isLast = true,
}: {
  criterion: Criterion
  variant: "original" | "appeal"
  depth: number
  originalMap?: Map<string, Criterion>
  isLast?: boolean
}) {
  const [open, setOpen] = useState(depth === 0)
  const hasChildren = !!criterion.children?.length
  const isLeaf = !hasChildren
  const met = criterion.state === "met"
  const isRoot = depth === 0

  const original = originalMap?.get(criterion.id)
  const flipped =
    variant === "appeal" &&
    !!original &&
    original.state === "not-met" &&
    criterion.state === "met"
  const unchanged =
    variant === "appeal" && !!original && original.state === criterion.state

  const headerTone = flipped
    ? "border-success/40 bg-success/[0.06]"
    : !met && !isRoot
      ? "border-destructive/40 bg-destructive/5"
      : isRoot
        ? "border-border bg-primary/5"
        : hasChildren
          ? "border-border bg-secondary/20"
          : "border-border bg-card"

  return (
    <div className={cn(depth > 0 && "relative pt-2")}>
      {depth > 0 && (
        <>
          <span
            aria-hidden
            className="absolute left-0 top-0 w-px bg-border"
            style={{ height: isLast ? "1.25rem" : "100%" }}
          />
          <span aria-hidden className="absolute left-0 top-5 h-px w-4 bg-border" />
        </>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "relative flex w-full items-start gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-secondary/40",
          headerTone,
        )}
      >
        <ChevronDown
          className={cn(
            "mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold",
            isRoot ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
          )}
        >
          {criterion.id}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={cn(
                "text-sm font-bold text-foreground",
                !met && variant === "original" && !hasChildren && "text-destructive",
              )}
            >
              {criterion.label}
            </h4>
            <div className="flex shrink-0 items-center gap-2">
              {!isRoot && (
                <ChangeBadge
                  variant={variant}
                  met={met}
                  flipped={flipped}
                  unchanged={unchanged}
                />
              )}
              {isRoot &&
                (met ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : (
                  <XCircle className="size-4 text-destructive" />
                ))}
            </div>
          </div>
          {!open && (
            <p className="mt-1 text-xs font-medium text-primary">
              {hasChildren
                ? `${criterion.children!.length} sub-criteria — click to expand`
                : "Click to view details"}
            </p>
          )}
          {open && !hasChildren && (
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {criterion.description}
            </p>
          )}
          {open && hasChildren && (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {criterion.description}
            </p>
          )}
        </div>
      </button>

      {open && hasChildren && (
        <ul className="relative ml-4 mt-1 space-y-0 pl-4">
          {criterion.children!.map((child, index) => (
            <li key={child.id} className="relative">
              <TreeNode
                criterion={child}
                variant={variant}
                depth={depth + 1}
                originalMap={originalMap}
                isLast={index === criterion.children!.length - 1}
              />
            </li>
          ))}
        </ul>
      )}

      {open && isLeaf && (
        <div
          className={cn(
            "ml-11 mt-1 rounded-md border border-border bg-secondary/20 px-3 py-2.5",
            flipped && "border-success/30 bg-success/[0.04]",
            !met && variant === "original" && "border-destructive/30 bg-destructive/[0.04]",
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Evidence
          </p>
          <p className="mt-1 text-xs leading-relaxed text-foreground">{criterion.evidence}</p>
        </div>
      )}
    </div>
  )
}

function ChangeBadge({
  variant,
  met,
  flipped,
  unchanged,
}: {
  variant: "original" | "appeal"
  met: boolean
  flipped: boolean
  unchanged: boolean
}) {
  if (variant === "original") {
    return (
      <span
        className={cn(
          "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
          met
            ? "bg-success/12 text-success"
            : "bg-destructive/10 text-destructive",
        )}
      >
        {met ? "Met" : "Not Met"}
      </span>
    )
  }
  if (flipped) {
    return (
      <span className="rounded bg-success px-1.5 py-0.5 text-[10px] font-bold uppercase text-success-foreground">
        Flipped to Met
      </span>
    )
  }
  return (
    <span className="rounded border border-border bg-card px-1.5 py-0.5 text-[10px] font-bold uppercase text-muted-foreground">
      Unchanged
    </span>
  )
}

/* ---------------- Footer ---------------- */

function FooterActions() {
  return (
    <div className="mt-8 flex flex-col items-stretch gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-destructive/30" /> Denied / Not Met
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded bg-success/30" /> Approved / Met
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline">
          <FileDown className="size-4" />
          Export Logic Comparison
        </Button>
        <Button size="lg">
          <CheckCircle className="size-4" />
          Finalize Appeal Decision
        </Button>
      </div>
    </div>
  )
}
