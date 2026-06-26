"use client"

import { useState } from "react"
import {
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  CircleCheck,
  FileDown,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Criterion, PriorAuthRequest } from "@/lib/data"

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
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Original */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Original Request</h2>
            <span className="rounded-md bg-destructive/10 px-2.5 py-1 text-xs font-bold text-destructive">
              DENIED
            </span>
          </div>
          <article className="h-full rounded-xl border border-border bg-card p-5 shadow-sm">
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
              <KeyVal label="Reviewer" value="Dr. Marcus Vance (Internal)" />
              <KeyVal label="Review Date" value="Oct 12, 2023" />
              <DepthRow label="Evidence Depth" filled={1} tone="destructive" />
            </div>
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
          <article className="h-full rounded-xl border-l-4 border-l-primary border border-border bg-card p-5 shadow-sm">
            <SectionLabel>Recommendation</SectionLabel>
            <p className="mt-1 text-base font-bold leading-snug text-primary">
              {appeal.recommendation}
            </p>
            <SectionLabel className="mt-5">Rationale</SectionLabel>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {appeal.rationale}
            </p>
            <div className="mt-5 space-y-3 border-t border-border pt-4">
              <KeyVal label="Appellate Reviewer" value={appeal.reviewer} />
              <KeyVal label="Review Date" value={appeal.reviewDate} />
              <DepthRow label="Evidence Depth" filled={3} tone="primary" />
            </div>
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

        <article className="flex flex-col items-center justify-center rounded-xl border border-border bg-card p-5 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Final Confidence Score
          </p>
          <ConfidenceRing value={92} />
          <p className="text-sm font-semibold text-primary">High Assurance Level</p>
        </article>
      </div>

      <FooterActions />
    </>
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

function DepthRow({
  label,
  filled,
  tone,
}: {
  label: string
  filled: number
  tone: "primary" | "destructive"
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-6 rounded-full",
              i < filled
                ? tone === "primary"
                  ? "bg-primary"
                  : "bg-destructive"
                : "bg-border",
            )}
          />
        ))}
      </span>
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
      <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-foreground">
            Original Determination
          </span>
          <span className="text-xs italic text-muted-foreground">
            {req.policyRef} — {req.policyVersion}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <Sparkles className="size-4" />
          New Evidence Integrated
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Original */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          {req.criteria.map((c) => (
            <TreeBlock key={c.id} root={c} variant="original" />
          ))}
        </div>

        {/* Appeal */}
        <div className="rounded-xl border-2 border-primary bg-card p-5 shadow-sm">
          {appeal.criteria.map((c) => (
            <TreeBlock
              key={c.id}
              root={c}
              variant="appeal"
              originalMap={originalMap}
            />
          ))}
        </div>
      </div>

      <FooterActions />
    </>
  )
}

function TreeBlock({
  root,
  variant,
  originalMap,
}: {
  root: Criterion
  variant: "original" | "appeal"
  originalMap?: Map<string, Criterion>
}) {
  const rootMet = root.state === "met"
  return (
    <div>
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CircleCheck className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground">{root.label}</h3>
          <p className="text-xs text-muted-foreground">{root.description}</p>
        </div>
        {rootMet ? (
          <CheckCircle2 className="size-5 shrink-0 text-success" />
        ) : (
          <XCircle className="size-5 shrink-0 text-destructive" />
        )}
      </div>

      <div className="mt-4 space-y-3 border-l-2 border-border pl-4">
        {root.children?.map((child) => {
          const original = originalMap?.get(child.id)
          const flipped =
            variant === "appeal" &&
            original &&
            original.state === "not-met" &&
            child.state === "met"
          const unchanged =
            variant === "appeal" &&
            original &&
            original.state === child.state
          return (
            <CriterionTile
              key={child.id}
              criterion={child}
              variant={variant}
              flipped={!!flipped}
              unchanged={!!unchanged}
            />
          )
        })}
      </div>
    </div>
  )
}

function CriterionTile({
  criterion,
  variant,
  flipped,
  unchanged,
}: {
  criterion: Criterion
  variant: "original" | "appeal"
  flipped: boolean
  unchanged: boolean
}) {
  const met = criterion.state === "met"

  // Visual tone
  const tone = flipped
    ? "border-success/40 bg-success/[0.06]"
    : !met
      ? "border-destructive/40 bg-destructive/5"
      : "border-border bg-secondary/30"

  return (
    <div className={cn("relative rounded-lg border p-3.5", tone)}>
      <div className="flex items-start gap-2.5">
        {met ? (
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
        ) : (
          <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h4
              className={cn(
                "text-sm font-bold",
                !met && variant === "original"
                  ? "text-destructive"
                  : "text-foreground",
              )}
            >
              {criterion.label}
            </h4>
            <ChangeBadge
              variant={variant}
              met={met}
              flipped={flipped}
              unchanged={unchanged}
            />
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {variant === "appeal" ? criterion.description : criterion.evidence}
          </p>
          {variant === "appeal" && flipped && (
            <p className="mt-2 rounded-md bg-card px-2.5 py-1.5 text-xs italic text-muted-foreground">
              {criterion.evidence}
            </p>
          )}
        </div>
      </div>
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
        <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-foreground px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90">
          <CheckCircle className="size-4" />
          Finalize Appeal Decision
        </button>
      </div>
    </div>
  )
}
