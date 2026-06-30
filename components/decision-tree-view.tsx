"use client"

import { useState, type ReactNode } from "react"
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Search,
  X,
  XCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Criterion, CriterionState, DecisionTree } from "@/lib/data"

function countCriteria(criteria: Criterion[]): number {
  return criteria.reduce(
    (sum, c) => sum + 1 + (c.children ? countCriteria(c.children) : 0),
    0,
  )
}

function toRomanLower(n: number): string {
  const numerals = [
    "i",
    "ii",
    "iii",
    "iv",
    "v",
    "vi",
    "vii",
    "viii",
    "ix",
    "x",
  ]
  return numerals[n - 1] ?? String(n)
}

function formatDisplayId(parentId: string, index: number, depth: number): string {
  if (depth === 0) return String(index + 1)
  if (depth === 1) return `${parentId}.${String.fromCharCode(97 + index)}`
  return `${parentId}.${toRomanLower(index + 1)}`
}

type TreeSection = "inclusion" | "exclusion"

type SelectedCriterion = Criterion & {
  displayId: string
  section: TreeSection
}

export function DecisionTreeView({
  criteria,
  determinationIssue,
}: {
  criteria: DecisionTree
  determinationIssue?: { requirement: string; detail: string }
}) {
  const [selected, setSelected] = useState<SelectedCriterion | null>(null)

  const handleSelect = (criterion: Criterion, displayId: string, section: TreeSection) => {
    setSelected({ ...criterion, displayId, section })
  }

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
        <h2 className="text-base font-bold text-foreground">Decision Tree</h2>
        <div className="flex items-center gap-4 text-xs font-medium">
          <StatusLegend state="met" />
          <StatusLegend state="not-met" />
          <StatusLegend state="not-found" />
        </div>
      </header>

      <div className={cn("flex", selected && "lg:divide-x lg:divide-border")}>
        <div className={cn("min-w-0 flex-1", selected && "lg:max-w-[58%]")}>
          <CriteriaSection
            section="inclusion"
            label="Inclusion Criteria"
            items={criteria.inclusion}
            selectedId={selected?.id ?? null}
            onSelect={handleSelect}
          />
          {criteria.exclusion.length > 0 && (
            <CriteriaSection
              section="exclusion"
              label="Exclusion Criteria"
              items={criteria.exclusion}
              selectedId={selected?.id ?? null}
              onSelect={handleSelect}
            />
          )}

          {determinationIssue && (
            <div className="border-t border-border p-5">
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-sm font-bold text-destructive">
                  Determination Issue Identified
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Requirement{" "}
                  <span className="font-semibold text-foreground">
                    {determinationIssue.requirement}
                  </span>{" "}
                  {determinationIssue.detail}
                </p>
              </div>
            </div>
          )}
        </div>

        {selected && (
          <EvaluationPanel
            criterion={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </section>
  )
}

function CriteriaSection({
  section,
  label,
  items,
  selectedId,
  onSelect,
}: {
  section: TreeSection
  label: string
  items: Criterion[]
  selectedId: string | null
  onSelect: (criterion: Criterion, displayId: string, section: TreeSection) => void
}) {
  const [open, setOpen] = useState(true)
  const count = countCriteria(items)
  const isExclusion = section === "exclusion"

  if (items.length === 0) return null

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2 px-5 py-3 text-left transition-colors hover:bg-muted/30",
          isExclusion ? "bg-destructive/[0.03]" : "bg-success/[0.03]",
        )}
      >
        {open ? (
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        )}
        <span
          className={cn(
            "text-sm font-semibold",
            isExclusion ? "text-destructive" : "text-success",
          )}
        >
          {label}
        </span>
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {count} items
        </span>
      </button>

      {open && (
        <div className="py-1">
          {items.map((criterion, index) => (
            <CriterionBranch
              key={criterion.id}
              criterion={criterion}
              displayId={formatDisplayId("", index, 0)}
              depth={0}
              section={section}
              selectedId={selectedId}
              onSelect={onSelect}
              showOrAfter={index < items.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function StatusLegend({ state }: { state: CriterionState }) {
  return (
    <span className="flex items-center gap-1.5 text-foreground">
      <StatusIcon state={state} className="size-3.5" />
      {state === "not-met" ? "NOT MET" : state === "not-found" ? "NOT FOUND" : "MET"}
    </span>
  )
}

function StatusIcon({
  state,
  className,
}: {
  state: CriterionState
  className?: string
}) {
  if (state === "met") {
    return (
      <CheckCircle2 className={cn("text-success", className)} aria-hidden />
    )
  }
  if (state === "not-found") {
    return (
      <span
        className={cn(
          "inline-flex items-center justify-center rounded-sm bg-warning text-warning-foreground",
          className,
        )}
        aria-hidden
      >
        <X className="size-[0.65em]" strokeWidth={3} />
      </span>
    )
  }
  return <XCircle className={cn("text-destructive", className)} aria-hidden />
}

function StatusLabel({
  state,
  section,
}: {
  state: CriterionState
  section?: TreeSection
}) {
  const label =
    section === "exclusion"
      ? state === "met"
        ? "Present"
        : state === "not-found"
          ? "Not Found"
          : "Not Present"
      : state === "met"
        ? "Met"
        : state === "not-found"
          ? "Not Found"
          : "Not Met"

  const tone =
    section === "exclusion"
      ? state === "met"
        ? "text-destructive"
        : state === "not-found"
          ? "text-warning"
          : "text-success"
      : state === "met"
        ? "text-success"
        : state === "not-met"
          ? "text-destructive"
          : "text-warning"

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-xs font-bold uppercase",
        tone,
      )}
    >
      <StatusIcon state={state} className="size-4" />
      {label}
    </span>
  )
}

function CriterionBranch({
  criterion,
  displayId,
  depth,
  section,
  selectedId,
  onSelect,
  showOrAfter,
}: {
  criterion: Criterion
  displayId: string
  depth: number
  section: TreeSection
  selectedId: string | null
  onSelect: (criterion: Criterion, displayId: string, section: TreeSection) => void
  showOrAfter: boolean
}) {
  const [open, setOpen] = useState(depth < 2)
  const hasChildren = Boolean(criterion.children?.length)
  const isSelected = selectedId === criterion.id
  const comment =
    criterion.evidence && criterion.evidence !== "None"
      ? criterion.evidence
      : criterion.state === "not-found"
        ? "None"
        : ""

  return (
    <div>
      <div
        className={cn(
          "group flex items-start gap-2 px-4 py-2.5 transition-colors",
          isSelected && "bg-muted/60",
          !isSelected && "hover:bg-muted/30",
        )}
        style={{ paddingLeft: `${1 + depth * 1.25}rem` }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="mt-0.5 shrink-0 rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        ) : (
          <span className="size-5 shrink-0" aria-hidden />
        )}

        <button
          type="button"
          onClick={() => onSelect(criterion, displayId, section)}
          className="flex min-w-0 flex-1 items-start gap-3 text-left"
        >
          <span className="mt-0.5 flex h-6 min-w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 px-1.5 text-xs font-bold text-primary">
            {displayId}
          </span>
          <span className="min-w-0 flex-1 pt-0.5 text-sm leading-snug text-foreground">
            {criterion.label}
            {criterion.description &&
              criterion.description !== criterion.label && (
                <span className="text-muted-foreground">
                  {" "}
                  {criterion.description}
                </span>
              )}
          </span>
        </button>

        <div className="flex shrink-0 items-start gap-6 pt-0.5">
          <StatusLabel state={criterion.state} section={section} />
          <p className="hidden w-44 text-right text-xs text-muted-foreground sm:block">
            {comment || "—"}
          </p>
        </div>
      </div>

      {open &&
        hasChildren &&
        criterion.children!.map((child, index) => (
          <CriterionBranch
            key={child.id}
            criterion={child}
            displayId={formatDisplayId(displayId, index, depth + 1)}
            depth={depth + 1}
            section={section}
            selectedId={selectedId}
            onSelect={onSelect}
            showOrAfter={index < criterion.children!.length - 1}
          />
        ))}

      {showOrAfter && (
        <p
          className="py-1 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground/70"
          style={{ paddingLeft: `${1 + depth * 1.25}rem` }}
        >
          OR
        </p>
      )}
    </div>
  )
}

function EvaluationPanel({
  criterion,
  onClose,
}: {
  criterion: SelectedCriterion
  onClose: () => void
}) {
  const isExclusion = criterion.section === "exclusion"
  const mapping =
    criterion.patientMapping ??
    (criterion.state === "not-found"
      ? "No matching patient data found in submitted records."
      : criterion.evidence)
  const rationale =
    criterion.rationale ??
    (isExclusion
      ? criterion.state === "met"
        ? `This exclusion is present. ${criterion.evidence}`
        : criterion.state === "not-found"
          ? "Could not determine whether this exclusion applies — insufficient documentation."
          : `This exclusion is not present based on submitted documentation.`
      : criterion.state === "not-met"
        ? `This criterion is not met. ${criterion.evidence}`
        : criterion.state === "not-found"
          ? "This criterion could not be evaluated — required documentation was not found in the medical record."
          : "This criterion is satisfied based on the submitted documentation.")

  return (
    <aside className="w-full shrink-0 border-t border-border bg-muted/20 lg:w-[42%] lg:border-t-0">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-bold text-foreground">Evaluation Details</h3>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close evaluation panel"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <DetailCard
          title={
            isExclusion
              ? `Exclusion (${criterion.displayId})`
              : `Policy Requirement (${criterion.displayId})`
          }
        >
          <p className="text-sm leading-relaxed text-foreground">
            {criterion.description || criterion.label}
          </p>
        </DetailCard>

        <DetailCard title={isExclusion ? "Exclusion Present?" : "Requirement Met?"}>
          <StatusLabel state={criterion.state} section={criterion.section} />
        </DetailCard>

        {criterion.evidence && criterion.evidence !== "None" && (
          <DetailCard title="Evidence from Medical Records">
            <p className="text-sm text-foreground">{criterion.evidence}</p>
            {criterion.sourceRef && (
              <Button variant="outline" size="sm" className="mt-3">
                <Search className="size-3.5" />
                View Source
              </Button>
            )}
          </DetailCard>
        )}

        <DetailCard title="Patient Data Mapping">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {mapping}
          </p>
        </DetailCard>

        <DetailCard title="Rationale">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {rationale}
          </p>
        </DetailCard>
      </div>
    </aside>
  )
}

function DetailCard({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </p>
      <div className="mt-2">{children}</div>
    </div>
  )
}
