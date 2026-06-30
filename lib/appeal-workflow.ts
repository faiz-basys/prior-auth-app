import type {
  Criterion,
  EvidenceDoc,
  RationaleItem,
  RequestStatus,
  DecisionTree,
} from "@/lib/data"

export type ReviewOutcome =
  | "approve"
  | "partial_approve"
  | "deny"
  | "missing_info"

export type WorkflowEventType =
  | "appeal_raised"
  | "route_pharmacy"
  | "pharmacy_review_complete"
  | "submit_med_director"
  | "med_director_review"
  | "p2p_letter_sent"
  | "missing_info"
  | "approved"
  | "partially_approved"
  | "denied"
  | "re_appeal_raised"

export interface WorkflowEvent {
  id: string
  cycleNumber: number
  type: WorkflowEventType
  title: string
  description: string
  timestamp: string
  outcome?: ReviewOutcome
}

export interface AppealCycleAiSummary {
  recommendation: string
  recommendationVerdict: "APPROVED" | "NOT APPROVED" | "PENDING"
  confidence: number
  rationale: RationaleItem[]
  checks: { label: string; sublabel: string; passed: boolean | null }[]
}

export interface AppealCycle {
  id: string
  cycleNumber: number
  raisedAt: string
  label: string
  evidence: EvidenceDoc[]
  criteria: DecisionTree
  aiSummary: AppealCycleAiSummary
  status: "active" | "superseded"
  determinationIssue?: { requirement: string; detail: string }
}

export interface AppealWorkflowState {
  events: WorkflowEvent[]
  cycles: AppealCycle[]
  status: RequestStatus
  lastUpdated: string
}

export function getActiveCycle(cycles: AppealCycle[]): AppealCycle {
  return (
    cycles.find((c) => c.status === "active") ??
    cycles[cycles.length - 1]
  )
}

export function sortEventsChronologically(events: WorkflowEvent[]): WorkflowEvent[] {
  return [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )
}

export function sortEventsReverseChronologically(
  events: WorkflowEvent[],
): WorkflowEvent[] {
  return sortEventsChronologically(events).reverse()
}

export type ActionDefinition = {
  type: WorkflowEventType
  label: string
  title: string
  description: string
  outcome?: ReviewOutcome
  group: "routing" | "outcome" | "re_appeal"
}

export const REVIEW_ACTIONS: ActionDefinition[] = [
  {
    type: "route_pharmacy",
    label: "Route to Pharmacy",
    title: "Routed to Pharmacy",
    description:
      "Pharmacy template created. Submitted to Step in A&G and clinical documentation uploaded to CCA.",
    group: "routing",
  },
  {
    type: "pharmacy_review_complete",
    label: "Pharmacy Review Complete",
    title: "Pharmacy Review Complete",
    description:
      "Pharmacy reviewed and returned to QMRU with recommendation.",
    group: "routing",
  },
  {
    type: "submit_med_director",
    label: "Submit to Med Director",
    title: "Submitted to Medical Director",
    description:
      "QMRU completed Medical Director Summary. Submitted in A&G. WebEx notification sent to Medical Director.",
    group: "routing",
  },
  {
    type: "med_director_review",
    label: "Med Director Review",
    title: "Medical Director Review",
    description: "Medical Director issued a review decision on this cycle.",
    group: "routing",
  },
  {
    type: "p2p_letter_sent",
    label: "Send P2P Letter",
    title: "P2P Letter Sent",
    description: "Peer-to-peer letter offered to the provider.",
    group: "routing",
  },
  {
    type: "missing_info",
    label: "Missing Info",
    title: "Missing Information Requested",
    description: "Additional documentation requested from the provider.",
    outcome: "missing_info",
    group: "outcome",
  },
  {
    type: "approved",
    label: "Approve",
    title: "Appeal Approved",
    description: "Coverage approved for this appeal cycle.",
    outcome: "approve",
    group: "outcome",
  },
  {
    type: "partially_approved",
    label: "Partially Approve",
    title: "Appeal Partially Approved",
    description: "Partial overturn — limited coverage approved.",
    outcome: "partial_approve",
    group: "outcome",
  },
  {
    type: "denied",
    label: "Deny",
    title: "Appeal Denied",
    description: "Denial upheld for this appeal cycle.",
    outcome: "deny",
    group: "outcome",
  },
  {
    type: "re_appeal_raised",
    label: "Re-raise Appeal",
    title: "Re-appeal Raised",
    description:
      "New appeal cycle opened with additional documentation submitted.",
    group: "re_appeal",
  },
]

export function outcomeToStatus(outcome: ReviewOutcome): RequestStatus {
  switch (outcome) {
    case "approve":
      return "Approved"
    case "partial_approve":
      return "Approved"
    case "deny":
      return "Denied"
    case "missing_info":
      return "Missing Info"
  }
}

export function createEvent(
  type: WorkflowEventType,
  cycleNumber: number,
  title: string,
  description: string,
  outcome?: ReviewOutcome,
): WorkflowEvent {
  return {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    cycleNumber,
    type,
    title,
    description,
    timestamp: new Date().toISOString(),
    outcome,
  }
}

export function createReAppealCycle(
  appealId: string,
  priorCycles: AppealCycle[],
  procedure: string,
): AppealCycle {
  const nextNumber = priorCycles.length + 1
  return {
    id: `${appealId}-cycle-${nextNumber}`,
    cycleNumber: nextNumber,
    raisedAt: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    label: `Round ${nextNumber} — Re-appeal with additional documentation`,
    status: "active",
    evidence: [],
    criteria: {
      inclusion: [
        {
          id: "A",
          label: "Appeal Criteria Review",
          description: `Decision tree for ${procedure} — pending AI analysis of new evidence.`,
          state: "not-met",
          evidence: "Awaiting documentation upload and auto-review.",
        },
      ],
      exclusion: [],
    },
    aiSummary: {
      recommendation:
        "New appeal cycle opened. Upload supplemental evidence to generate an updated AI recommendation and decision tree.",
      recommendationVerdict: "PENDING",
      confidence: 0,
      rationale: [],
      checks: [
        { label: "Medical Necessity", sublabel: "Pending", passed: null },
        { label: "Plan Eligibility", sublabel: "Pending", passed: null },
        { label: "Provider Network", sublabel: "Pending", passed: null },
      ],
    },
  }
}

export function applyAction(
  state: AppealWorkflowState,
  action: ActionDefinition,
  appealId: string,
  procedure: string,
): AppealWorkflowState {
  const activeCycle = getActiveCycle(state.cycles)
  const now = new Date().toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })

  if (action.type === "re_appeal_raised") {
    const supersededCycles = state.cycles.map((c) =>
      c.status === "active" ? { ...c, status: "superseded" as const } : c,
    )
    const newCycle = createReAppealCycle(appealId, state.cycles, procedure)
    const event = createEvent(
      action.type,
      newCycle.cycleNumber,
      action.title,
      action.description,
    )
    return {
      events: [...state.events, event],
      cycles: [...supersededCycles, newCycle],
      status: "In Review",
      lastUpdated: now,
    }
  }

  const event = createEvent(
    action.type,
    activeCycle.cycleNumber,
    action.title,
    action.description,
    action.outcome,
  )

  let status = state.status
  if (action.outcome) {
    status = outcomeToStatus(action.outcome)
  } else if (action.type === "submit_med_director" || action.type === "med_director_review") {
    status = "In Review"
  }

  return {
    ...state,
    events: [...state.events, event],
    status,
    lastUpdated: now,
  }
}

export type EventVisualCategory =
  | "routing"
  | "decision"
  | "approved"
  | "partial_approve"
  | "denied"
  | "missing_info"
  | "re_appeal"

export function getEventCategory(type: WorkflowEventType): EventVisualCategory {
  if (type === "re_appeal_raised") return "re_appeal"
  if (type === "approved") return "approved"
  if (type === "partially_approved") return "partial_approve"
  if (type === "denied") return "denied"
  if (type === "missing_info") return "missing_info"
  if (type === "med_director_review" || type === "p2p_letter_sent") {
    return "decision"
  }
  return "routing"
}

export function getOutcomeButtonClass(type: WorkflowEventType): string {
  switch (type) {
    case "approved":
      return "border-success/50 bg-success text-white hover:bg-success/90"
    case "partially_approved":
      return "border-sky-500/40 bg-sky-500/15 text-sky-700 hover:bg-sky-500/25 dark:text-sky-300"
    case "denied":
      return "border-destructive/50 bg-destructive text-white hover:bg-destructive/90"
    case "missing_info":
      return "border-warning/50 bg-warning/15 text-warning hover:bg-warning/25"
    default:
      return ""
  }
}
