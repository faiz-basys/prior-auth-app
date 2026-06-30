"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    CheckCircle2,
    CircleDot,
    GitCompare,
    Info,
    XCircle,
} from "lucide-react";
import { ActionConfirmDialog } from "@/components/action-confirm-dialog";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { AppealCycleReview } from "@/components/appeal-cycle-review";
import { useAppealWorkflow } from "@/components/appeal-workflow-context";
import { cn } from "@/lib/utils";
import { featureFlags } from "@/lib/feature-flags";
import type { AppealRequest } from "@/lib/data";
import type { AppealLetter } from "@/lib/appeal-letters";
import type { AppealLetterContext } from "@/lib/appeal-letters";
import {
    REVIEW_ACTIONS,
    applyAction,
    getActiveCycle,
    getOutcomeButtonClass,
    resolveCycleId,
    type ActionDefinition,
    type AppealWorkflowState,
    type WorkflowEventType,
} from "@/lib/appeal-workflow";

export function AppealReviewWorkspace({
    appeal,
    requestedCycleId,
}: {
    appeal: AppealRequest;
    requestedCycleId?: string;
}) {
    const defaults: AppealWorkflowState = {
        events: appeal.events,
        cycles: appeal.cycles,
        status: appeal.status,
        lastUpdated: appeal.lastUpdated,
    };

    const [state, setState] = useAppealWorkflow(appeal.id, defaults);
    const activeCycle = getActiveCycle(state.cycles);
    const [selectedCycleId, setSelectedCycleId] = useState(() =>
        resolveCycleId(defaults.cycles, requestedCycleId),
    );
    const [pendingAction, setPendingAction] = useState<ActionDefinition | null>(
        null,
    );

    useEffect(() => {
        setSelectedCycleId(resolveCycleId(state.cycles, requestedCycleId));
    }, [requestedCycleId, state.cycles]);

    const executeAction = useCallback(
        (action: ActionDefinition, letter?: AppealLetter) => {
            setState((prev) => {
                const next = applyAction(
                    prev,
                    action,
                    appeal.id,
                    appeal.procedure,
                    letter,
                );
                if (action.type === "re_appeal_raised") {
                    const newActive = getActiveCycle(next.cycles);
                    setSelectedCycleId(newActive.id);
                    window.history.replaceState(
                        null,
                        "",
                        `/appeals/${appeal.id}?cycle=${newActive.id}`,
                    );
                }
                return next;
            });
        },
        [appeal.id, appeal.procedure, setState],
    );

    const requestAction = useCallback((actionType: WorkflowEventType) => {
        const action = REVIEW_ACTIONS.find((a) => a.type === actionType);
        if (action) setPendingAction(action);
    }, []);

    const confirmPendingAction = useCallback(
        (letter?: AppealLetter) => {
            if (!pendingAction) return;
            executeAction(pendingAction, letter);
            setPendingAction(null);
        },
        [pendingAction, executeAction],
    );

    const routingActions = REVIEW_ACTIONS.filter((a) => a.group === "routing");
    const decisionActions = REVIEW_ACTIONS.filter((a) => a.group === "outcome");
    const reAppealAction = REVIEW_ACTIONS.find((a) => a.group === "re_appeal");

    const selectedCycle =
        state.cycles.find((c) => c.id === selectedCycleId) ?? activeCycle;

    const letterContext: AppealLetterContext = {
        caseId: appeal.caseId,
        procedure: appeal.procedure,
        procedureCode: appeal.procedureCode,
        patientName: appeal.patient.name,
        payerName: appeal.payerName,
        policyRef: appeal.policyRef,
        providerName: appeal.provider.name,
        recommendation:
            activeCycle.aiSummary.recommendation ?? appeal.recommendation,
        rationale: activeCycle.aiSummary.rationale,
    };
    const isActiveCycle = selectedCycle.id === activeCycle.id;
    const actionsAvailable = state.status === "In Review";

    return (
        <>
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_22rem]">
                <div className="flex flex-col gap-6">
                    <AppealCycleReview
                        cycles={state.cycles}
                        selectedCycleId={selectedCycleId}
                        caseId={appeal.caseId}
                        submitted={appeal.submitted}
                        policyCodes={appeal.policyCodes}
                        policyFile={appeal.policyFile}
                        policyRef={appeal.policyRef}
                    />
                </div>

                <div className="flex flex-col gap-6">
                    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Current Status
                        </h2>
                        <div className="mt-3 rounded-lg border border-warning/30 bg-warning/10 p-3">
                            <div className="flex items-center gap-2">
                                <Info className="size-4 text-warning" />
                                <StatusBadge status={state.status} />
                            </div>
                            <p className="mt-0.5 pl-6 text-xs text-muted-foreground">
                                Last updated · {state.lastUpdated}
                            </p>
                        </div>
                    </section>

                    {isActiveCycle ? (
                        <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-base font-semibold text-foreground">
                                Workflow Actions
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Active cycle: {activeCycle.label}
                            </p>

                            <div className="mt-4">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Actions
                                </p>
                                {actionsAvailable ? (
                                    <div className="mt-2 flex flex-col gap-2">
                                        {decisionActions.map((action) => (
                                            <Button
                                                key={action.type}
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start gap-2 border",
                                                    getOutcomeButtonClass(
                                                        action.type,
                                                    ),
                                                )}
                                                onClick={() =>
                                                    requestAction(action.type)
                                                }
                                            >
                                                <DecisionActionIcon
                                                    type={action.type}
                                                />
                                                {action.label}
                                            </Button>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="mt-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-sm text-muted-foreground">
                                        Decision recorded — status is{" "}
                                        <span className="font-semibold text-foreground">
                                            {state.status}
                                        </span>
                                        .
                                    </p>
                                )}
                            </div>

                            {featureFlags.routingActions && (
                                <div className="mt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Routing
                                    </p>
                                    {actionsAvailable ? (
                                        <div className="mt-2 flex flex-col gap-2">
                                            {routingActions.map((action) => (
                                                <Button
                                                    key={action.type}
                                                    variant="outline"
                                                    className="w-full justify-start"
                                                    onClick={() =>
                                                        requestAction(
                                                            action.type,
                                                        )
                                                    }
                                                >
                                                    {action.label}
                                                </Button>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="mt-2 text-sm text-muted-foreground">
                                            Routing is closed for this cycle.
                                        </p>
                                    )}
                                </div>
                            )}

                            {featureFlags.reAppeal && reAppealAction && (
                                <div className="mt-4 border-t border-border pt-4">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        New Cycle
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-2 w-full justify-start"
                                        onClick={() =>
                                            requestAction(reAppealAction.type)
                                        }
                                    >
                                        {reAppealAction.label}
                                    </Button>
                                    <p className="mt-1.5 text-xs text-muted-foreground">
                                        Opens a new appeal level with a fresh
                                        decision tree and AI summary.
                                    </p>
                                </div>
                            )}
                        </section>
                    ) : (
                        <section className="rounded-xl border border-border bg-muted/30 p-5 shadow-sm">
                            <p className="text-sm text-muted-foreground">
                                Viewing a prior level. Workflow actions apply to
                                the active cycle only.
                            </p>
                            <Link
                                href={`/appeals/${appeal.id}?cycle=${activeCycle.id}`}
                                className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
                            >
                                Open active level review
                            </Link>
                        </section>
                    )}

                    <Link
                        href={`/appeals/${appeal.id}/timeline`}
                        className="block text-center text-sm font-semibold text-primary hover:underline"
                    >
                        Back to timeline
                    </Link>

                    {featureFlags.comparison && state.cycles.length >= 2 && (
                        <Link
                            href={`/appeals/${appeal.id}/compare-levels`}
                            className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                        >
                            <GitCompare className="size-4" />
                            Compare levels
                        </Link>
                    )}
                </div>
            </div>

            <ActionConfirmDialog
                action={pendingAction}
                letterContext={letterContext}
                onConfirm={confirmPendingAction}
                onCancel={() => setPendingAction(null)}
            />
        </>
    );
}

function DecisionActionIcon({ type }: { type: WorkflowEventType }) {
    switch (type) {
        case "approved":
            return <CheckCircle2 className="size-4 shrink-0" />;
        case "partially_approved":
            return <CircleDot className="size-4 shrink-0" />;
        case "denied":
            return <XCircle className="size-4 shrink-0" />;
        case "missing_info":
            return <AlertTriangle className="size-4 shrink-0" />;
        default:
            return null;
    }
}
