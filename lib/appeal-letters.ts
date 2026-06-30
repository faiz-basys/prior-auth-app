import type { WorkflowEventType } from "@/lib/appeal-workflow"

export type AppealLetterType =
  | "denial"
  | "approval"
  | "partial_approval"
  | "missing_info"

export interface AppealLetter {
  type: AppealLetterType
  title: string
  generatedAt: string
  aiSummary: string
  body: string
}

export interface AppealLetterContext {
  caseId: string
  procedure: string
  procedureCode: string
  patientName: string
  payerName: string
  policyRef: string
  providerName: string
  recommendation: string
  rationale?: string
}

const LETTER_TYPE_BY_ACTION: Partial<
  Record<WorkflowEventType, AppealLetterType>
> = {
  denied: "denial",
  approved: "approval",
  partially_approved: "partial_approval",
  missing_info: "missing_info",
}

export function actionGeneratesLetter(
  actionType: WorkflowEventType,
): actionType is keyof typeof LETTER_TYPE_BY_ACTION {
  return actionType in LETTER_TYPE_BY_ACTION
}

export function getLetterTypeForAction(
  actionType: WorkflowEventType,
): AppealLetterType | null {
  return LETTER_TYPE_BY_ACTION[actionType] ?? null
}

export function getLetterLabel(type: AppealLetterType): string {
  switch (type) {
    case "denial":
      return "Denial Letter"
    case "approval":
      return "Approval Letter"
    case "partial_approval":
      return "Partial Approval Letter"
    case "missing_info":
      return "Missing Information Letter"
  }
}

export function generateAppealLetter(
  ctx: AppealLetterContext,
  actionType: WorkflowEventType,
): AppealLetter | null {
  const type = getLetterTypeForAction(actionType)
  if (!type) return null

  const generatedAt = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  switch (type) {
    case "denial":
      return {
        type,
        title: getLetterLabel(type),
        generatedAt,
        aiSummary: `Basys recommends upholding the denial for ${ctx.procedure} (${ctx.procedureCode}). ${ctx.recommendation} The drafted letter cites ${ctx.policyRef}, documents the criteria gap, and notifies the provider of appeal rights.`,
        body: `Dear ${ctx.providerName},

Re: Appeal ${ctx.caseId} — ${ctx.procedure} (${ctx.procedureCode})
Member: ${ctx.patientName}
Plan: ${ctx.payerName}

After review of the appeal submission and applicable medical policy (${ctx.policyRef}), we are unable to approve the requested service.

${ctx.recommendation}

${ctx.rationale ? `${ctx.rationale}\n\n` : ""}This determination is based on the documentation submitted with the appeal and the clinical criteria outlined in the referenced policy. You may submit additional clinical records for reconsideration or request a peer-to-peer review within the timeframe specified in your plan materials.

Sincerely,
Clinical Review Unit
${ctx.payerName}`,
      }
    case "approval":
      return {
        type,
        title: getLetterLabel(type),
        generatedAt,
        aiSummary: `Basys supports overturning the prior denial for ${ctx.procedure}. Appeal documentation satisfies ${ctx.policyRef} criteria. The approval letter confirms medical necessity, authorization effective dates, and any utilization management requirements.`,
        body: `Dear ${ctx.providerName},

Re: Appeal ${ctx.caseId} — ${ctx.procedure} (${ctx.procedureCode})
Member: ${ctx.patientName}
Plan: ${ctx.payerName}

We have completed our review of the appeal submitted for the above-referenced service. Based on the clinical documentation provided and ${ctx.policyRef}, coverage is approved.

${ctx.recommendation}

Authorization is granted subject to plan benefits and any applicable prior authorization requirements. Please retain this notice with the member's medical record.

Sincerely,
Clinical Review Unit
${ctx.payerName}`,
      }
    case "partial_approval":
      return {
        type,
        title: getLetterLabel(type),
        generatedAt,
        aiSummary: `Basys recommends a partial overturn for ${ctx.procedure}. Some appeal criteria are met under ${ctx.policyRef}, but limitations apply. The letter specifies approved scope, quantity or duration limits, and any remaining denied components.`,
        body: `Dear ${ctx.providerName},

Re: Appeal ${ctx.caseId} — ${ctx.procedure} (${ctx.procedureCode})
Member: ${ctx.patientName}
Plan: ${ctx.payerName}

Our review under ${ctx.policyRef} supports partial approval of the appealed request.

${ctx.recommendation}

Approved services are limited to the scope documented in the appeal file. Any services outside the approved parameters remain non-covered. Contact Utilization Management if you need clarification on authorized units or dates of service.

Sincerely,
Clinical Review Unit
${ctx.payerName}`,
      }
    case "missing_info":
      return {
        type,
        title: getLetterLabel(type),
        generatedAt,
        aiSummary: `Basys cannot finalize the determination for ${ctx.procedure} without additional records. The missing-information letter lists required documentation, references ${ctx.policyRef}, and provides a response deadline for the provider.`,
        body: `Dear ${ctx.providerName},

Re: Appeal ${ctx.caseId} — ${ctx.procedure} (${ctx.procedureCode})
Member: ${ctx.patientName}
Plan: ${ctx.payerName}

We have reviewed the appeal submitted for the above-referenced service. Additional information is required before a final determination can be issued under ${ctx.policyRef}.

${ctx.recommendation}

Please submit the requested documentation within 30 calendar days of this notice. If the information is not received, the appeal may be decided based on the records currently on file.

Sincerely,
Clinical Review Unit
${ctx.payerName}`,
      }
  }
}

export function letterSectionAccent(type: AppealLetterType): {
  border: string
  header: string
  title: string
} {
  switch (type) {
    case "denial":
      return {
        border: "border-destructive/25",
        header: "border-destructive/20 bg-destructive/5",
        title: "text-destructive",
      }
    case "approval":
      return {
        border: "border-success/25",
        header: "border-success/20 bg-success/5",
        title: "text-success",
      }
    case "partial_approval":
      return {
        border: "border-sky-500/25",
        header: "border-sky-500/20 bg-sky-500/5",
        title: "text-sky-700 dark:text-sky-300",
      }
    case "missing_info":
      return {
        border: "border-warning/30",
        header: "border-warning/25 bg-warning/10",
        title: "text-warning",
      }
  }
}
