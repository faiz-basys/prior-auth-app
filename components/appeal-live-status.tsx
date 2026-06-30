"use client"

import { StatusBadge } from "@/components/status-badge"
import { useAppealWorkflow } from "@/components/appeal-workflow-context"
import type { AppealWorkflowState } from "@/lib/appeal-workflow"

export function AppealLiveStatus({
  appealId,
  defaults,
}: {
  appealId: string
  defaults: AppealWorkflowState
}) {
  const [state] = useAppealWorkflow(appealId, defaults)
  return <StatusBadge status={state.status} />
}
