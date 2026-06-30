"use client"

import { useEffect, useState } from "react"
import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { AppealLetter } from "@/lib/appeal-letters"
import {
  actionGeneratesLetter,
  generateAppealLetter,
  type AppealLetterContext,
} from "@/lib/appeal-letters"
import type { ActionDefinition } from "@/lib/appeal-workflow"
import { getOutcomeButtonClass } from "@/lib/appeal-workflow"

export function ActionConfirmDialog({
  action,
  letterContext,
  onConfirm,
  onCancel,
}: {
  action: ActionDefinition | null
  letterContext: AppealLetterContext | null
  onConfirm: (letter?: AppealLetter) => void
  onCancel: () => void
}) {
  const [phase, setPhase] = useState<"generating" | "ready">("generating")
  const [draftLetter, setDraftLetter] = useState<AppealLetter | null>(null)

  const needsLetter =
    action != null &&
    letterContext != null &&
    actionGeneratesLetter(action.type)

  useEffect(() => {
    if (!action || !needsLetter || !letterContext) {
      setPhase("ready")
      setDraftLetter(null)
      return
    }

    setPhase("generating")
    setDraftLetter(null)

    const timer = window.setTimeout(() => {
      const letter = generateAppealLetter(letterContext, action.type)
      setDraftLetter(letter)
      setPhase("ready")
    }, 2200)

    return () => window.clearTimeout(timer)
  }, [action, needsLetter, letterContext])

  if (!action) return null

  const isDecisionAction = action.group === "outcome"
  const confirmClass = isDecisionAction
    ? cn("border", getOutcomeButtonClass(action.type))
    : action.type === "re_appeal_raised"
      ? "border-orange-500/40 bg-orange-500/15 text-orange-700 hover:bg-orange-500/25 dark:text-orange-300"
      : ""

  const confirmDisabled = needsLetter && (phase === "generating" || !draftLetter)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close dialog"
        onClick={onCancel}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-confirm-title"
        className="relative flex max-h-[min(90vh,680px)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
      >
        <div className="border-b border-border px-6 py-5">
          <h3
            id="action-confirm-title"
            className="text-lg font-bold text-foreground"
          >
            {needsLetter ? "Review generated letter" : "Confirm action"}
          </h3>
          <p className="mt-1 text-sm font-semibold text-primary">
            {action.label}
          </p>
          {!needsLetter && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {action.description}
            </p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {needsLetter ? (
            <>
              {phase === "generating" ? (
                <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
                  <div className="flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <Sparkles className="size-6 animate-pulse text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Basys is drafting your letter…
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Generating AI summary and correspondence from the appeal
                      record
                    </p>
                  </div>
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              ) : draftLetter ? (
                <div className="space-y-4">
                  <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-4 text-primary" />
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        AI Summary
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {draftLetter.aiSummary}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Letter preview
                    </p>
                    <div className="mt-2 max-h-52 overflow-y-auto rounded-lg border border-border bg-muted/30 p-4">
                      <p className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground">
                        {draftLetter.body}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Accept this letter to record the {action.label.toLowerCase()}{" "}
                    decision on the appeal timeline.
                  </p>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              This will be recorded on the appeal timeline for the active round.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border px-6 py-4 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className={confirmClass}
            disabled={confirmDisabled}
            onClick={() => onConfirm(draftLetter ?? undefined)}
          >
            {needsLetter ? `Accept & ${action.label}` : `Confirm ${action.label}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
