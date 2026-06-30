"use client"

import { useState, type ReactNode } from "react"
import {
  Pencil,
  FileText,
  ImageIcon,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { DecisionTreeView } from "@/components/decision-tree-view"
import type { AppealCycle } from "@/lib/appeal-workflow"

const evidenceIcon = {
  image: ImageIcon,
  pdf: FileText,
  lab: BarChart3,
} as const

type ReviewTab = "overview" | "tree"

export function AppealCycleReview({
  cycles,
  selectedCycleId,
}: {
  cycles: AppealCycle[]
  selectedCycleId: string
}) {
  const cycle = cycles.find((c) => c.id === selectedCycleId) ?? cycles[cycles.length - 1]
  const [tab, setTab] = useState<ReviewTab>("overview")

  if (!cycle) return null

  const denied = cycle.aiSummary.recommendationVerdict !== "APPROVED"

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-6 border-b border-border">
        {(
          [
            ["overview", "Overview"],
            ["tree", "Decision Tree"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "border-b-2 pb-3 text-sm font-medium transition-colors",
              tab === id
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <OverviewTab cycle={cycle} denied={denied} />
      ) : (
        <DecisionTreeView
          criteria={cycle.criteria}
          determinationIssue={cycle.determinationIssue}
        />
      )}
    </div>
  )
}

function OverviewTab({
  cycle,
  denied,
}: {
  cycle: AppealCycle
  denied: boolean
}) {
  return (
    <>
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div
          className={cn(
            "border-l-4 p-5",
            denied ? "border-l-destructive" : "border-l-success",
          )}
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-foreground">
                Basys Recommendation
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                AI Summary · {cycle.label}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-md px-2 py-0.5 text-xs font-bold",
                    denied
                      ? "bg-destructive/10 text-destructive"
                      : "bg-success/12 text-success",
                  )}
                >
                  {cycle.aiSummary.recommendationVerdict}
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {cycle.aiSummary.recommendation}
              </p>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-3xl font-bold",
                  denied ? "text-destructive" : "text-success",
                )}
              >
                {cycle.aiSummary.confidence}%
              </p>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Confidence Score
              </p>
            </div>
          </div>
        </div>
      </section>

      {cycle.aiSummary.rationale.length > 0 && (
        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              Decision Rationale
            </h2>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <Pencil className="size-3.5" />
              Edit Rationale
            </button>
          </div>
          <ol className="mt-4 flex flex-col">
            {cycle.aiSummary.rationale.map((item, i) => (
              <li key={item.title} className="relative flex gap-4 pb-6 last:pb-0">
                {i < cycle.aiSummary.rationale.length - 1 && (
                  <span className="absolute left-[15px] top-9 h-[calc(100%-1.5rem)] w-px bg-border" />
                )}
                <span className="z-10 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <div className="min-w-0 pt-1">
                  <h3 className="text-sm font-bold text-foreground">
                    {item.title}
                  </h3>
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
      )}

      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <header className="border-b border-border px-5 py-4">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Evidence · {cycle.label} ({cycle.evidence.length})
          </h2>
        </header>
        <ul className="divide-y divide-border">
          {cycle.evidence.map((doc) => {
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
                      {doc.changeNote && ` · ${doc.changeNote}`}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </>
  )
}
