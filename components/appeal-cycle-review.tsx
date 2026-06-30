"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { DecisionTreeView } from "@/components/decision-tree-view";
import { CorrespondenceLetterSection } from "@/components/correspondence-letter-section";
import { EvidenceDocRow } from "@/components/evidence-doc-row";
import { PolicyContextSection } from "@/components/policy-context-section";
import { RequiredDocumentationSection } from "@/components/required-documentation-section";
import type { AppealCycle } from "@/lib/appeal-workflow";

type ReviewTab = "overview" | "tree";

export function AppealCycleReview({
    cycles,
    selectedCycleId,
    caseId,
    submitted,
    policyCodes,
    policyFile,
    policyRef,
}: {
    cycles: AppealCycle[];
    selectedCycleId: string;
    caseId: string;
    submitted?: string;
    policyCodes: string[];
    policyFile: string;
    policyRef: string;
}) {
    const cycle =
        cycles.find((c) => c.id === selectedCycleId) ??
        cycles[cycles.length - 1];
    const [tab, setTab] = useState<ReviewTab>("overview");

    if (!cycle) return null;

    const denied = cycle.aiSummary.recommendationVerdict !== "APPROVED";

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6 border-b border-border">
                {(
                    [
                        ["overview", "Overview"],
                        ["tree", "Decision Tree"],
                    ] as const
                ).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        onClick={() => setTab(id)}
                        className={cn(
                            "border-b-2 pb-3 text-sm font-medium transition-colors",
                            tab === id
                                ? "border-primary font-semibold text-primary"
                                : "border-transparent text-muted-foreground hover:text-foreground",
                        )}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {tab === "overview" ? (
                <OverviewTab
                    cycle={cycle}
                    denied={denied}
                    caseId={caseId}
                    submitted={submitted}
                    policyCodes={policyCodes}
                    policyFile={policyFile}
                    policyRef={policyRef}
                />
            ) : (
                <DecisionTreeView
                    criteria={cycle.criteria}
                    determinationIssue={cycle.determinationIssue}
                />
            )}
        </div>
    );
}

function OverviewTab({
    cycle,
    denied,
    caseId,
    submitted,
    policyCodes,
    policyFile,
    policyRef,
}: {
    cycle: AppealCycle;
    denied: boolean;
    caseId: string;
    submitted?: string;
    policyCodes: string[];
    policyFile: string;
    policyRef: string;
}) {
    return (
        <>
            <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <div
                    className={cn(
                        "border-l-4 p-5",
                        denied ? "border-l-destructive" : "border-l-success",
                    )}
                >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                            <h2 className="text-lg font-bold text-foreground">
                                Basys Recommendation
                            </h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                AI Summary · {cycle.label}
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <span
                                    className={cn(
                                        "rounded-md px-2 py-0.5 text-xs font-bold",
                                        denied
                                            ? "bg-destructive/10 text-destructive"
                                            : "bg-success/12 text-success",
                                    )}
                                >
                                    {cycle.aiSummary.recommendationVerdict}
                                </span>
                            </div>
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                                {cycle.aiSummary.recommendation}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {cycle.aiSummary.rationale && (
                <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground">
                        Decision Rationale
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        {cycle.aiSummary.rationale}
                    </p>
                </section>
            )}

            <RequiredDocumentationSection
                caseId={caseId}
                submitted={submitted}
            />

            <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
                <header className="border-b border-border px-5 py-4">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Supporting Evidence · {cycle.label} ({cycle.evidence.length})
                    </h2>
                </header>
                <ul className="divide-y divide-border">
                    {cycle.evidence.map((doc) => (
                        <EvidenceDocRow key={doc.name} doc={doc} />
                    ))}
                </ul>
            </section>

            {cycle.letter && (
                <CorrespondenceLetterSection letter={cycle.letter} />
            )}

            <PolicyContextSection
                policyCodes={policyCodes}
                policyFile={policyFile}
                policyRef={policyRef}
            />
        </>
    );
}
