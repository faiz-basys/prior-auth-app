"use client"

import { useEffect, useMemo, useState } from "react"
import {
  ArrowRight,
  FileText,
  ImageIcon,
  BarChart3,
  Minus,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppealWorkflow } from "@/components/appeal-workflow-context"
import type { Criterion, EvidenceDoc } from "@/lib/data"
import { flattenDecisionTree } from "@/lib/data"
import type { AppealCycle, AppealWorkflowState } from "@/lib/appeal-workflow"

type CompareMode = "overview" | "tree" | "evidence"

function flattenCriteria(criteria: AppealCycle["criteria"]): Criterion[] {
  return flattenDecisionTree(criteria)
}

function verdictStyle(verdict: AppealCycle["aiSummary"]["recommendationVerdict"]) {
  if (verdict === "APPROVED") {
    return {
      badge: "bg-success/12 text-success",
      text: "text-success",
      border: "border-l-success",
    }
  }
  if (verdict === "NOT APPROVED") {
    return {
      badge: "bg-destructive/10 text-destructive",
      text: "text-destructive",
      border: "border-l-destructive",
    }
  }
  return {
    badge: "bg-primary/10 text-primary",
    text: "text-primary",
    border: "border-l-primary",
  }
}

export function RoundCompareView({
  appealId,
  defaults,
  defaultLeftId,
  defaultRightId,
}: {
  appealId: string
  defaults: AppealWorkflowState
  defaultLeftId?: string
  defaultRightId?: string
}) {
  const [state] = useAppealWorkflow(appealId, defaults)
  const cycles = state.cycles
  const [mode, setMode] = useState<CompareMode>("overview")

  const sorted = useMemo(
    () => [...cycles].sort((a, b) => a.cycleNumber - b.cycleNumber),
    [cycles],
  )

  const [leftId, setLeftId] = useState(
    defaultLeftId ?? sorted[0]?.id ?? "",
  )
  const [rightId, setRightId] = useState(
    defaultRightId ?? sorted[sorted.length - 1]?.id ?? "",
  )

  useEffect(() => {
    if (defaultLeftId) setLeftId(defaultLeftId)
    if (defaultRightId) setRightId(defaultRightId)
  }, [defaultLeftId, defaultRightId])

  const left = cycles.find((c) => c.id === leftId)
  const right = cycles.find((c) => c.id === rightId)

  if (cycles.length < 2) {
    return (
      <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
        <h2 className="text-lg font-bold text-foreground">
          At least two rounds required
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Re-raise an appeal to create a second round before comparing.
        </p>
      </div>
    )
  }

  if (!left || !right) return null

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-wrap items-end gap-3">
          <CycleSelect
            label="Round A"
            value={leftId}
            cycles={sorted}
            onChange={setLeftId}
            excludeId={rightId}
          />
          <ArrowRight className="mb-2.5 size-5 text-muted-foreground" />
          <CycleSelect
            label="Round B"
            value={rightId}
            cycles={sorted}
            onChange={setRightId}
            excludeId={leftId}
          />
        </div>

        <div className="flex rounded-lg border border-border bg-card p-1 shadow-sm">
          {(["overview", "tree", "evidence"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-semibold capitalize transition-colors",
                mode === m
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "tree" ? "Decision Tree" : m}
            </button>
          ))}
        </div>
      </div>

      {leftId === rightId ? (
        <p className="mt-6 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-muted-foreground">
          Select two different rounds to compare.
        </p>
      ) : mode === "overview" ? (
        <OverviewCompare left={left} right={right} />
      ) : mode === "tree" ? (
        <TreeCompare left={left} right={right} />
      ) : (
        <EvidenceCompare left={left} right={right} />
      )}
    </div>
  )
}

function CycleSelect({
  label,
  value,
  cycles,
  onChange,
  excludeId,
}: {
  label: string
  value: string
  cycles: AppealCycle[]
  onChange: (id: string) => void
  excludeId?: string
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 min-w-[220px] rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      >
        {cycles
          .filter((c) => c.id !== excludeId)
          .map((c) => (
            <option key={c.id} value={c.id}>
              Round {c.cycleNumber} — {c.label}
            </option>
          ))}
      </select>
    </label>
  )
}

function OverviewCompare({
  left,
  right,
}: {
  left: AppealCycle
  right: AppealCycle
}) {
  const leftStyle = verdictStyle(left.aiSummary.recommendationVerdict)
  const rightStyle = verdictStyle(right.aiSummary.recommendationVerdict)
  const confidenceDelta =
    right.aiSummary.confidence - left.aiSummary.confidence

  return (
    <div className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DeltaCard
          label="Confidence change"
          value={`${confidenceDelta >= 0 ? "+" : ""}${confidenceDelta}%`}
          positive={confidenceDelta > 0}
        />
        <DeltaCard
          label="Round A verdict"
          value={left.aiSummary.recommendationVerdict}
        />
        <DeltaCard
          label="Round B verdict"
          value={right.aiSummary.recommendationVerdict}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RoundPanel cycle={left} style={leftStyle} />
        <RoundPanel cycle={right} style={rightStyle} />
      </div>

      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h3 className="text-base font-bold text-foreground">
          What changed between rounds
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {buildSummaryDelta(left, right)}
        </p>
      </section>
    </div>
  )
}

function buildSummaryDelta(left: AppealCycle, right: AppealCycle): string {
  const leftFlat = flattenCriteria(left.criteria)
  const rightFlat = flattenCriteria(right.criteria)
  const improved = rightFlat.filter((r) => {
    const l = leftFlat.find((x) => x.id === r.id)
    return l && l.state === "not-met" && r.state === "met"
  })
  const newDocs = right.evidence.filter(
    (d) => !left.evidence.some((e) => e.name === d.name),
  )

  const parts: string[] = []
  if (newDocs.length > 0) {
    parts.push(
      `Round B added ${newDocs.length} document(s): ${newDocs.map((d) => d.name).join(", ")}.`,
    )
  }
  if (improved.length > 0) {
    parts.push(
      `Criteria improved from NOT MET to MET: ${improved.map((c) => c.label).join("; ")}.`,
    )
  }
  if (left.aiSummary.confidence !== right.aiSummary.confidence) {
    parts.push(
      `AI confidence shifted from ${left.aiSummary.confidence}% to ${right.aiSummary.confidence}%.`,
    )
  }
  if (parts.length === 0) {
    return "No significant structural changes detected between the selected rounds."
  }
  return parts.join(" ")
}

function DeltaCard({
  label,
  value,
  positive,
}: {
  label: string
  value: string
  positive?: boolean
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-xl font-bold",
          positive === true && "text-success",
          positive === false && "text-destructive",
        )}
      >
        {value}
      </p>
    </div>
  )
}

function RoundPanel({
  cycle,
  style,
}: {
  cycle: AppealCycle
  style: ReturnType<typeof verdictStyle>
}) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl border border-l-4 border-border bg-card shadow-sm",
        style.border,
      )}
    >
      <div className="border-b border-border bg-muted/30 px-5 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-primary">
          Round {cycle.cycleNumber}
        </p>
        <p className="text-sm font-semibold text-foreground">{cycle.label}</p>
        <p className="text-xs text-muted-foreground">Raised {cycle.raisedAt}</p>
      </div>
      <div className="p-5">
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-bold",
              style.badge,
            )}
          >
            {cycle.aiSummary.recommendationVerdict}
          </span>
          <span className={cn("text-2xl font-bold", style.text)}>
            {cycle.aiSummary.confidence}%
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">
          Recommendation
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {cycle.aiSummary.recommendation}
        </p>
      </div>
    </article>
  )
}

function TreeCompare({
  left,
  right,
}: {
  left: AppealCycle
  right: AppealCycle
}) {
  const leftFlat = flattenCriteria(left.criteria)
  const rightFlat = flattenCriteria(right.criteria)
  const allIds = [
    ...new Set([...leftFlat.map((c) => c.id), ...rightFlat.map((c) => c.id)]),
  ]

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="grid grid-cols-2 gap-4 border-b border-border bg-muted/30 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <span>Round {left.cycleNumber}</span>
        <span>Round {right.cycleNumber}</span>
      </header>
      <ul className="divide-y divide-border">
        {allIds.map((id) => {
          const l = leftFlat.find((c) => c.id === id)
          const r = rightFlat.find((c) => c.id === id)
          const changed = l && r && l.state !== r.state

          return (
            <li
              key={id}
              className={cn(
                "grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-2",
                changed && "bg-primary/5",
              )}
            >
              <CriterionCell criterion={l} label={`Round ${left.cycleNumber}`} />
              <CriterionCell criterion={r} label={`Round ${right.cycleNumber}`} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function CriterionCell({
  criterion,
  label,
}: {
  criterion?: Criterion
  label: string
}) {
  if (!criterion) {
    return (
      <div className="text-sm italic text-muted-foreground">
        {label}: Not evaluated
      </div>
    )
  }
  const met = criterion.state === "met"
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs font-bold text-primary">
          {criterion.id}
        </span>
        <span
          className={cn(
            "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
            met ? "bg-success/12 text-success" : "bg-destructive/10 text-destructive",
          )}
        >
          {met ? "MET" : "NOT MET"}
        </span>
      </div>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {criterion.label}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        {criterion.evidence}
      </p>
    </div>
  )
}

const evidenceIcon = {
  image: ImageIcon,
  pdf: FileText,
  lab: BarChart3,
} as const

function EvidenceCompare({
  left,
  right,
}: {
  left: AppealCycle
  right: AppealCycle
}) {
  const leftNames = new Set(left.evidence.map((d) => d.name))
  const rightNames = new Set(right.evidence.map((d) => d.name))
  const onlyLeft = left.evidence.filter((d) => !rightNames.has(d.name))
  const onlyRight = right.evidence.filter((d) => !leftNames.has(d.name))
  const shared = left.evidence.filter((d) => rightNames.has(d.name))

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <EvidenceColumn
        title={`Only in Round ${left.cycleNumber}`}
        docs={onlyLeft}
        emptyLabel="No unique documents"
        icon={Minus}
      />
      <EvidenceColumn
        title="In both rounds"
        docs={shared}
        emptyLabel="No shared documents"
      />
      <EvidenceColumn
        title={`Only in Round ${right.cycleNumber}`}
        docs={onlyRight}
        emptyLabel="No new documents"
        icon={Plus}
        highlight
      />
    </div>
  )
}

function EvidenceColumn({
  title,
  docs,
  emptyLabel,
  icon: Icon,
  highlight,
}: {
  title: string
  docs: EvidenceDoc[]
  emptyLabel: string
  icon?: typeof Plus
  highlight?: boolean
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
        highlight && "border-success/30",
      )}
    >
      <header
        className={cn(
          "flex items-center gap-2 border-b border-border px-4 py-3",
          highlight ? "bg-success/5" : "bg-muted/30",
        )}
      >
        {Icon && <Icon className="size-4 text-muted-foreground" />}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {docs.length}
        </span>
      </header>
      {docs.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <ul className="divide-y divide-border">
          {docs.map((doc) => {
            const DocIcon = evidenceIcon[doc.type]
            return (
              <li key={doc.name} className="flex gap-3 px-4 py-3">
                <DocIcon className="size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {doc.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {doc.added} · {doc.size}
                  </p>
                  {doc.changeNote && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {doc.changeNote}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
