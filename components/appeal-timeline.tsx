"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    CheckCircle2,
    CircleDot,
    Diamond,
    FileSearch,
    GitBranch,
    GitCompare,
    RotateCcw,
    XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { featureFlags } from "@/lib/feature-flags";
import { useAppealWorkflow } from "@/components/appeal-workflow-context";
import {
    getEventCategory,
    sortEventsReverseChronologically,
    type AppealCycle,
    type AppealWorkflowState,
    type WorkflowEvent,
} from "@/lib/appeal-workflow";

const categoryStyles = {
    routing: {
        node: "border-success/40 bg-success/10 text-success",
        icon: CheckCircle2,
        badge: "bg-success/12 text-success",
        label: "Routing",
    },
    decision: {
        node: "border-warning/50 bg-warning/15 text-warning",
        icon: Diamond,
        badge: "bg-warning/15 text-warning",
        label: "Decision",
    },
    approved: {
        node: "border-success/50 bg-success/15 text-success",
        icon: CheckCircle2,
        badge: "bg-success/12 text-success",
        label: "Approved",
    },
    partial_approve: {
        node: "border-sky-500/50 bg-sky-500/15 text-sky-700 dark:text-sky-300",
        icon: CircleDot,
        badge: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
        label: "Partial Approval",
    },
    denied: {
        node: "border-destructive/50 bg-destructive/15 text-destructive",
        icon: XCircle,
        badge: "bg-destructive/10 text-destructive",
        label: "Denied",
    },
    missing_info: {
        node: "border-warning/50 bg-warning/15 text-warning",
        icon: AlertTriangle,
        badge: "bg-warning/15 text-warning",
        label: "Missing Info",
    },
    re_appeal: {
        node: "border-orange-500/40 bg-orange-500/10 text-orange-600",
        icon: RotateCcw,
        badge: "bg-orange-500/10 text-orange-600",
        label: "Re-appeal",
    },
};

function formatTimestamp(ts: string) {
    try {
        return new Date(ts).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    } catch {
        return ts;
    }
}

export function AppealTimeline({
    appealId,
    defaults,
}: {
    appealId: string;
    defaults: AppealWorkflowState;
}) {
    const [state] = useAppealWorkflow(appealId, defaults);
    const { events, cycles: storedCycles } = state;

    const cyclesNewestFirst = useMemo(
        () => [...storedCycles].sort((a, b) => b.cycleNumber - a.cycleNumber),
        [storedCycles],
    );

    const sortedAsc = useMemo(
        () => [...storedCycles].sort((a, b) => a.cycleNumber - b.cycleNumber),
        [storedCycles],
    );

    const eventsByCycle = useMemo(() => {
        const map = new Map<number, WorkflowEvent[]>();
        for (const cycle of storedCycles) {
            const cycleEvents = events.filter(
                (e) => e.cycleNumber === cycle.cycleNumber,
            );
            map.set(
                cycle.cycleNumber,
                sortEventsReverseChronologically(cycleEvents),
            );
        }
        return map;
    }, [events, storedCycles]);

    const oldestCycleId = sortedAsc[0]?.id;

    return (
        <section className="rounded-xl border border-border bg-card shadow-sm">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold text-foreground">
                        Appeal Timeline
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Newest activity first. Open any level to review its
                        decision tree and AI summary.
                    </p>
                </div>
                {featureFlags.comparison && storedCycles.length >= 2 && (
                    <Link
                        href={`/appeals/${appealId}/compare-levels`}
                        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                    >
                        <GitCompare className="size-4" />
                        Compare Rounds
                    </Link>
                )}
            </header>

            {cyclesNewestFirst.length === 0 ? (
                <p className="px-5 py-8 text-center text-sm text-muted-foreground">
                    No appeal cycles recorded yet.
                </p>
            ) : (
                <div className="divide-y divide-border">
                    {cyclesNewestFirst.map((cycle) => {
                        const cycleEvents =
                            eventsByCycle.get(cycle.cycleNumber) ?? [];

                        return (
                            <section key={cycle.id}>
                                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-4">
                                    <div className="flex items-center gap-3">
                                        <GitBranch className="size-4 shrink-0 text-primary" />
                                        <div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                                                    Level {cycle.cycleNumber}
                                                </p>
                                                {cycle.status === "active" && (
                                                    <span className="rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold uppercase text-primary">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {cycle.label}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Link
                                            href={`/appeals/${appealId}?cycle=${cycle.id}`}
                                            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                                        >
                                            <FileSearch className="size-4" />
                                            Open Review
                                        </Link>
                                        {featureFlags.comparison &&
                                            storedCycles.length >= 2 &&
                                            cycle.id !== oldestCycleId && (
                                                <Link
                                                    href={`/appeals/${appealId}/compare-levels?left=${oldestCycleId}&right=${cycle.id}`}
                                                    className="inline-flex h-9 shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                                                >
                                                    <GitCompare className="size-4" />
                                                    Compare
                                                </Link>
                                            )}
                                    </div>
                                </div>

                                {cycleEvents.length === 0 ? (
                                    <p className="px-5 py-6 text-sm text-muted-foreground">
                                        No events recorded for this level.
                                    </p>
                                ) : (
                                    <ol className="divide-y divide-border">
                                        {cycleEvents.map((event, index) => {
                                            const category = getEventCategory(
                                                event.type,
                                            );
                                            const styles =
                                                categoryStyles[category];
                                            const Icon = styles.icon;
                                            const isLast =
                                                index ===
                                                cycleEvents.length - 1;

                                            return (
                                                <li
                                                    key={event.id}
                                                    className="relative px-5 py-5"
                                                >
                                                    {!isLast && (
                                                        <span className="absolute left-[2.15rem] top-14 h-[calc(100%-2rem)] w-px bg-border" />
                                                    )}

                                                    <div className="flex gap-4">
                                                        <span
                                                            className={cn(
                                                                "relative z-10 flex size-9 shrink-0 items-center justify-center rounded-md border-2",
                                                                styles.node,
                                                            )}
                                                        >
                                                            <Icon className="size-4" />
                                                        </span>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex flex-wrap items-center gap-2">
                                                                <h3 className="text-sm font-bold text-foreground">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </h3>
                                                                <span
                                                                    className={cn(
                                                                        "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                                                                        styles.badge,
                                                                    )}
                                                                >
                                                                    {
                                                                        styles.label
                                                                    }
                                                                </span>
                                                            </div>
                                                            <p className="mt-1 text-xs text-muted-foreground">
                                                                {formatTimestamp(
                                                                    event.timestamp,
                                                                )}
                                                            </p>
                                                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                                                {
                                                                    event.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ol>
                                )}
                            </section>
                        );
                    })}
                </div>
            )}
        </section>
    );
}
