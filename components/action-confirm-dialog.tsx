"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ActionDefinition } from "@/lib/appeal-workflow"
import { getOutcomeButtonClass } from "@/lib/appeal-workflow"

export function ActionConfirmDialog({
  action,
  onConfirm,
  onCancel,
}: {
  action: ActionDefinition | null
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!action) return null

  const isDecisionAction = action.group === "outcome"
  const confirmClass = isDecisionAction
    ? cn("border", getOutcomeButtonClass(action.type))
    : action.type === "re_appeal_raised"
      ? "border-orange-500/40 bg-orange-500/15 text-orange-700 hover:bg-orange-500/25 dark:text-orange-300"
      : ""

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
        className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
      >
        <h3
          id="action-confirm-title"
          className="text-lg font-bold text-foreground"
        >
          Confirm action
        </h3>
        <p className="mt-1 text-sm font-semibold text-primary">{action.label}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {action.description}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          This will be recorded on the appeal timeline for the active round.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className={confirmClass}
            onClick={onConfirm}
          >
            Confirm {action.label}
          </Button>
        </div>
      </div>
    </div>
  )
}
