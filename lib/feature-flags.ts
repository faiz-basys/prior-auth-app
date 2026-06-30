function readBooleanFlag(
  value: string | undefined,
  defaultValue: boolean,
): boolean {
  if (value === undefined || value === "") return defaultValue
  return value === "true" || value === "1"
}

/** Which appeal seed dataset to load: simplified demo timelines or full legacy cases. Default: demo. */
export type AppealDataset = "demo" | "legacy"

export function getAppealDataset(): AppealDataset {
  const raw = process.env.NEXT_PUBLIC_APPEAL_DATASET?.trim().toLowerCase()
  if (raw === "legacy") return "legacy"
  return "demo"
}

export const appealDataset = getAppealDataset()

/** Workflow routing actions (Route to Pharmacy, Med Director, etc.). Default: off. */
export const routingActionsEnabled = readBooleanFlag(
  process.env.NEXT_PUBLIC_FEATURE_ROUTING_ACTIONS,
  false,
)

/** Comparison UI and routes (Compare Rounds, Compare Appeal). Default: off. */
export const comparisonEnabled = readBooleanFlag(
  process.env.NEXT_PUBLIC_FEATURE_COMPARISON,
  false,
)

/** Re-raise appeal / new cycle action. Default: off. */
export const reAppealEnabled = readBooleanFlag(
  process.env.NEXT_PUBLIC_FEATURE_RE_APPEAL,
  false,
)

export const featureFlags = {
  routingActions: routingActionsEnabled,
  comparison: comparisonEnabled,
  reAppeal: reAppealEnabled,
  appealDataset,
} as const
