"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ArrowRight,
    FileText,
    ImageIcon,
    BarChart3,
    Minus,
    Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentViewButton } from "@/components/document-view-button";
import { RequiredDocumentationSection } from "@/components/required-documentation-section";
import { useAppealWorkflow } from "@/components/appeal-workflow-context";
import type { Criterion, EvidenceDoc } from "@/lib/data";
import type { AppealCycle, AppealWorkflowState } from "@/lib/appeal-workflow";

type CompareMode = "overview" | "tree" | "evidence";

function flattenWithDepth(
    criteria: AppealCycle["criteria"],
): { criterion: Criterion; depth: number }[] {
    const out: { criterion: Criterion; depth: number }[] = [];
    const walk = (items: Criterion[], depth: number) => {
        for (const c of items) {
            out.push({ criterion: c, depth });
            if (c.children?.length) walk(c.children, depth + 1);
        }
    };
    walk(criteria.inclusion, 0);
    walk(criteria.exclusion, 0);
    return out;
}

function mergeCriterionIds(
    leftFlat: { criterion: Criterion; depth: number }[],
    rightFlat: { criterion: Criterion; depth: number }[],
): { id: string; depth: number }[] {
    const seen = new Set<string>();
    const rows: { id: string; depth: number }[] = [];

    for (const { criterion, depth } of rightFlat) {
        if (seen.has(criterion.id)) continue;
        seen.add(criterion.id);
        const leftDepth =
            leftFlat.find((x) => x.criterion.id === criterion.id)?.depth ??
            depth;
        rows.push({ id: criterion.id, depth: Math.max(depth, leftDepth) });
    }

    for (const { criterion, depth } of leftFlat) {
        if (seen.has(criterion.id)) continue;
        seen.add(criterion.id);
        rows.push({ id: criterion.id, depth });
    }

    return rows;
}

function verdictStyle(
    verdict: AppealCycle["aiSummary"]["recommendationVerdict"],
) {
    if (verdict === "APPROVED") {
        return {
            badge: "bg-success/12 text-success",
            text: "text-success",
            border: "border-l-success",
        };
    }
    if (verdict === "NOT APPROVED") {
        return {
            badge: "bg-destructive/10 text-destructive",
            text: "text-destructive",
            border: "border-l-destructive",
        };
    }
    return {
        badge: "bg-primary/10 text-primary",
        text: "text-primary",
        border: "border-l-primary",
    };
}

export function RoundCompareView({
    appealId,
    caseId,
    submitted,
    defaults,
    defaultLeftId,
    defaultRightId,
}: {
    appealId: string;
    caseId: string;
    submitted?: string;
    defaults: AppealWorkflowState;
    defaultLeftId?: string;
    defaultRightId?: string;
}) {
    const [state] = useAppealWorkflow(appealId, defaults);
    const cycles = state.cycles;
    const [mode, setMode] = useState<CompareMode>("overview");

    const sorted = useMemo(
        () => [...cycles].sort((a, b) => a.cycleNumber - b.cycleNumber),
        [cycles],
    );

    const [leftId, setLeftId] = useState(defaultLeftId ?? sorted[0]?.id ?? "");
    const [rightId, setRightId] = useState(
        defaultRightId ?? sorted[sorted.length - 1]?.id ?? "",
    );

    useEffect(() => {
        if (defaultLeftId) setLeftId(defaultLeftId);
        if (defaultRightId) setRightId(defaultRightId);
    }, [defaultLeftId, defaultRightId]);

    const left = cycles.find((c) => c.id === leftId);
    const right = cycles.find((c) => c.id === rightId);

    if (cycles.length < 2) {
        return (
            <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
                <h2 className="text-lg font-bold text-foreground">
                    At least two levels required
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                    Re-raise an appeal to create a second level before
                    comparing.
                </p>
            </div>
        );
    }

    if (!left || !right) return null;

    return (
        <div>
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-wrap items-end gap-3">
                    <CycleSelect
                        label="Level A"
                        value={leftId}
                        cycles={sorted}
                        onChange={setLeftId}
                        excludeId={rightId}
                    />
                    <ArrowRight className="mb-2.5 size-5 text-muted-foreground" />
                    <CycleSelect
                        label="Level B"
                        value={rightId}
                        cycles={sorted}
                        onChange={setRightId}
                        excludeId={leftId}
                    />
                </div>

                <div className="flex rounded-lg border border-border bg-card p-1 shadow-sm">
                    {(["overview", "tree", "evidence"] as const).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            className={cn(
                                "rounded-md px-3 py-2 text-sm font-semibold capitalize transition-colors",
                                mode === m
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-muted-foreground hover:text-foreground",
                            )}
                        >
                            {m === "tree" ? "Decision Tree" : m}
                        </button>
                    ))}
                </div>
            </div>

            {leftId === rightId ? (
                <p className="mt-6 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-muted-foreground">
                    Select two different levels to compare.
                </p>
            ) : mode === "overview" ? (
                <OverviewCompare left={left} right={right} />
            ) : mode === "tree" ? (
                <TreeCompare left={left} right={right} />
            ) : (
                <EvidenceCompare
                    left={left}
                    right={right}
                    caseId={caseId}
                    submitted={submitted}
                />
            )}
        </div>
    );
}

function CycleSelect({
    label,
    value,
    cycles,
    onChange,
    excludeId,
}: {
    label: string;
    value: string;
    cycles: AppealCycle[];
    onChange: (id: string) => void;
    excludeId?: string;
}) {
    return (
        <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </span>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 min-w-[220px] rounded-lg border border-border bg-card px-3 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
                {cycles
                    .filter((c) => c.id !== excludeId)
                    .map((c) => (
                        <option key={c.id} value={c.id}>
                            Level {c.cycleNumber} — {c.label}
                        </option>
                    ))}
            </select>
        </label>
    );
}

function OverviewCompare({
    left,
    right,
}: {
    left: AppealCycle;
    right: AppealCycle;
}) {
    const leftStyle = verdictStyle(left.aiSummary.recommendationVerdict);
    const rightStyle = verdictStyle(right.aiSummary.recommendationVerdict);
    const confidenceDelta =
        right.aiSummary.confidence - left.aiSummary.confidence;

    return (
        <div className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <DeltaCard
                    label="Level A verdict"
                    value={left.aiSummary.recommendationVerdict}
                />
                <DeltaCard
                    label="Level B verdict"
                    value={right.aiSummary.recommendationVerdict}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <RoundPanel cycle={left} style={leftStyle} />
                <RoundPanel cycle={right} style={rightStyle} />
            </div>

            <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <h3 className="text-base font-bold text-foreground">
                    What changed between levels
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {buildSummaryDelta(left, right)}
                </p>
            </section>
        </div>
    );
}

function buildSummaryDelta(left: AppealCycle, right: AppealCycle): string {
    const leftFlat = flattenWithDepth(left.criteria).map((x) => x.criterion);
    const rightFlat = flattenWithDepth(right.criteria).map((x) => x.criterion);
    const improved = rightFlat.filter((r) => {
        const l = leftFlat.find((x) => x.id === r.id);
        return l && l.state === "not-met" && r.state === "met";
    });
    const newDocs = right.evidence.filter(
        (d) => !left.evidence.some((e) => e.name === d.name),
    );

    const parts: string[] = [];
    if (newDocs.length > 0) {
        parts.push(
            `Level B added ${newDocs.length} document(s): ${newDocs.map((d) => d.name).join(", ")}.`,
        );
    }
    if (improved.length > 0) {
        parts.push(
            `Criteria improved from NOT MET to MET: ${improved.map((c) => c.label).join("; ")}.`,
        );
    }
    if (left.aiSummary.confidence !== right.aiSummary.confidence) {
        parts.push(
            `AI confidence shifted from ${left.aiSummary.confidence}% to ${right.aiSummary.confidence}%.`,
        );
    }
    if (parts.length === 0) {
        return "No significant structural changes detected between the selected levels.";
    }
    return parts.join(" ");
}

function DeltaCard({
    label,
    value,
    positive,
}: {
    label: string;
    value: string;
    positive?: boolean;
}) {
    return (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p
                className={cn(
                    "mt-1 text-xl font-bold",
                    positive === true && "text-success",
                    positive === false && "text-destructive",
                )}
            >
                {value}
            </p>
        </div>
    );
}

function RoundPanel({
    cycle,
    style,
}: {
    cycle: AppealCycle;
    style: ReturnType<typeof verdictStyle>;
}) {
    return (
        <article
            className={cn(
                "overflow-hidden rounded-xl border border-l-4 border-border bg-card shadow-sm",
                style.border,
            )}
        >
            <div className="border-b border-border bg-muted/30 px-5 py-3">
                <p className="text-xs font-bold uppercase tracking-wide text-primary">
                    Level {cycle.cycleNumber}
                </p>
                <p className="text-sm font-semibold text-foreground">
                    {cycle.label}
                </p>
                <p className="text-xs text-muted-foreground">
                    Raised {cycle.raisedAt}
                </p>
            </div>
            <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                    <span
                        className={cn(
                            "rounded-md px-2 py-0.5 text-xs font-bold",
                            style.badge,
                        )}
                    >
                        {cycle.aiSummary.recommendationVerdict}
                    </span>
                </div>
                <p className="mt-3 text-sm font-semibold text-foreground">
                    Recommendation
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {cycle.aiSummary.recommendation}
                </p>
            </div>
        </article>
    );
}

function TreeCompare({
    left,
    right,
}: {
    left: AppealCycle;
    right: AppealCycle;
}) {
    const leftFlat = flattenWithDepth(left.criteria);
    const rightFlat = flattenWithDepth(right.criteria);
    const rows = mergeCriterionIds(leftFlat, rightFlat);

    return (
        <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <header className="grid grid-cols-2 gap-4 border-b border-border bg-muted/30 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span>Level {left.cycleNumber}</span>
                <span>Level {right.cycleNumber}</span>
            </header>
            <ul className="divide-y divide-border">
                {rows.map(({ id, depth }) => {
                    const l = leftFlat.find(
                        (x) => x.criterion.id === id,
                    )?.criterion;
                    const r = rightFlat.find(
                        (x) => x.criterion.id === id,
                    )?.criterion;
                    const changed = l && r && l.state !== r.state;
                    const indent =
                        depth > 0 ? `${1.25 + depth * 1.25}rem` : undefined;

                    return (
                        <li
                            key={id}
                            className={cn(
                                "grid grid-cols-1 gap-3 py-4 md:grid-cols-2",
                                changed && "bg-primary/5",
                            )}
                            style={
                                indent
                                    ? {
                                          paddingLeft: indent,
                                          paddingRight: "1.25rem",
                                      }
                                    : {
                                          paddingLeft: "1.25rem",
                                          paddingRight: "1.25rem",
                                      }
                            }
                        >
                            <CriterionCell
                                criterion={l}
                                label={`Level ${left.cycleNumber}`}
                            />
                            <CriterionCell
                                criterion={r}
                                label={`Level ${right.cycleNumber}`}
                            />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

function CriterionCell({
    criterion,
    label,
}: {
    criterion?: Criterion;
    label: string;
}) {
    if (!criterion) {
        return (
            <div className="text-sm italic text-muted-foreground">
                {label}: Not evaluated
            </div>
        );
    }
    const met = criterion.state === "met";
    return (
        <div>
            <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                    {criterion.id}
                </span>
                <span
                    className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                        met
                            ? "bg-success/12 text-success"
                            : "bg-destructive/10 text-destructive",
                    )}
                >
                    {met ? "MET" : "NOT MET"}
                </span>
            </div>
            <p className="mt-1 text-sm font-semibold text-foreground">
                {criterion.label}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
                {criterion.evidence}
            </p>
        </div>
    );
}

const evidenceIcon = {
    image: ImageIcon,
    pdf: FileText,
    lab: BarChart3,
} as const;

function EvidenceCompare({
    left,
    right,
    caseId,
    submitted,
}: {
    left: AppealCycle;
    right: AppealCycle;
    caseId: string;
    submitted?: string;
}) {
    const leftNames = new Set(left.evidence.map((d) => d.name));
    const rightNames = new Set(right.evidence.map((d) => d.name));
    const onlyLeft = left.evidence.filter((d) => !rightNames.has(d.name));
    const onlyRight = right.evidence.filter((d) => !leftNames.has(d.name));
    const shared = left.evidence.filter((d) => rightNames.has(d.name));

    return (
        <div className="mt-6 flex flex-col gap-6">
            <RequiredDocumentationSection
                caseId={caseId}
                submitted={submitted}
            />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <EvidenceColumn
                    title={`Only in Level ${left.cycleNumber}`}
                    docs={onlyLeft}
                    emptyLabel="No unique documents"
                    icon={Minus}
                />
                <EvidenceColumn
                    title="In both levels"
                    docs={shared}
                    emptyLabel="No shared documents"
                />
                <EvidenceColumn
                    title={`Only in Level ${right.cycleNumber}`}
                    docs={onlyRight}
                    emptyLabel="No new documents"
                    icon={Plus}
                    highlight
                />
            </div>
        </div>
    );
}

function EvidenceColumn({
    title,
    docs,
    emptyLabel,
    icon: Icon,
    highlight,
}: {
    title: string;
    docs: EvidenceDoc[];
    emptyLabel: string;
    icon?: typeof Plus;
    highlight?: boolean;
}) {
    return (
        <section
            className={cn(
                "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
                highlight && "border-success/30",
            )}
        >
            <header
                className={cn(
                    "flex items-center gap-2 border-b border-border px-4 py-3",
                    highlight ? "bg-success/5" : "bg-muted/30",
                )}
            >
                {Icon && <Icon className="size-4 text-muted-foreground" />}
                <h3 className="text-sm font-semibold text-foreground">
                    {title}
                </h3>
                <span className="ml-auto text-xs text-muted-foreground">
                    {docs.length}
                </span>
            </header>
            {docs.length === 0 ? (
                <p className="px-4 py-6 text-sm text-muted-foreground">
                    {emptyLabel}
                </p>
            ) : (
                <ul className="divide-y divide-border">
                    {docs.map((doc) => {
                        const DocIcon = evidenceIcon[doc.type];
                        return (
                            <li
                                key={doc.name}
                                className="flex items-center justify-between gap-3 px-4 py-3"
                            >
                                <div className="flex min-w-0 gap-3">
                                    <DocIcon className="size-4 shrink-0 text-primary" />
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {doc.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {doc.added} · {doc.size}
                                        </p>
                                        {doc.changeNote && (
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                {doc.changeNote}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <DocumentViewButton />
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
}
