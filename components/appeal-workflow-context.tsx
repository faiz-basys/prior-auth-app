"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { AppealWorkflowState } from "@/lib/appeal-workflow"

type WorkflowStateMap = Record<string, AppealWorkflowState>

interface AppealWorkflowContextValue {
  getWorkflowState: (
    appealId: string,
    defaults: AppealWorkflowState,
  ) => AppealWorkflowState
  setWorkflowState: (appealId: string, state: AppealWorkflowState) => void
}

const AppealWorkflowContext = createContext<AppealWorkflowContextValue | null>(
  null,
)

export function AppealWorkflowProvider({ children }: { children: ReactNode }) {
  const [stateMap, setStateMap] = useState<WorkflowStateMap>({})

  const getWorkflowState = useCallback(
    (appealId: string, defaults: AppealWorkflowState) =>
      stateMap[appealId] ?? defaults,
    [stateMap],
  )

  const setWorkflowState = useCallback(
    (appealId: string, state: AppealWorkflowState) => {
      setStateMap((prev) => ({ ...prev, [appealId]: state }))
    },
    [],
  )

  const value = useMemo(
    () => ({ getWorkflowState, setWorkflowState }),
    [getWorkflowState, setWorkflowState],
  )

  return (
    <AppealWorkflowContext.Provider value={value}>
      {children}
    </AppealWorkflowContext.Provider>
  )
}

export function useAppealWorkflow(
  appealId: string,
  defaults: AppealWorkflowState,
) {
  const ctx = useContext(AppealWorkflowContext)
  if (!ctx) {
    throw new Error("useAppealWorkflow must be used within AppealWorkflowProvider")
  }

  const state = ctx.getWorkflowState(appealId, defaults)

  const setState = useCallback(
    (
      updater:
        | AppealWorkflowState
        | ((prev: AppealWorkflowState) => AppealWorkflowState),
    ) => {
      const current = ctx.getWorkflowState(appealId, defaults)
      const next =
        typeof updater === "function" ? updater(current) : updater
      ctx.setWorkflowState(appealId, next)
    },
    [appealId, ctx, defaults],
  )

  return [state, setState] as const
}
