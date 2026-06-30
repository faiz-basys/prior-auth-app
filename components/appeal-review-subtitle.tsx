"use client"

import { useAppealWorkflow } from "@/components/appeal-workflow-context"
import {
  getActiveCycle,
  resolveCycleId,
  type AppealWorkflowState,
} from "@/lib/appeal-workflow"

export function AppealReviewSubtitle({
  appealId,
  caseId,
  defaults,
  requestedCycleId,
}: {
  appealId: string
  caseId: string
  defaults: AppealWorkflowState
  requestedCycleId?: string
}) {
  const [state] = useAppealWorkflow(appealId, defaults)
  const cycleId = resolveCycleId(state.cycles, requestedCycleId)
  const cycle =
    state.cycles.find((c) => c.id === cycleId) ?? getActiveCycle(state.cycles)

  return (
    <p className="mt-1 text-sm text-muted-foreground">
      {caseId} · {cycle.label}
    </p>
  )
}
