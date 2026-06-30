import Link from "next/link";
import { notFound } from "next/navigation";
import { GitCompare } from "lucide-react";
import { Breadcrumb } from "@/components/breadcrumb";
import { RoundCompareView } from "@/components/level-compare-view";
import { getAppeal } from "@/lib/data";
import { featureFlags } from "@/lib/feature-flags";

export default async function CompareRoundsPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ left?: string; right?: string }>;
}) {
    const { id } = await params;
    const { left, right } = await searchParams;
    const appeal = getAppeal(id);
    if (!appeal) notFound();
    if (!featureFlags.comparison) notFound();

    const sorted = [...appeal.cycles].sort(
        (a, b) => a.cycleNumber - b.cycleNumber,
    );
    const defaultLeftId = left ?? sorted[0]?.id;
    const defaultRightId = right ?? sorted[sorted.length - 1]?.id;

    return (
        <div className="w-full">
            <Breadcrumb
                items={[
                    { label: "Appeals", href: "/appeals" },
                    {
                        label: `Appeal #${appeal.caseId}`,
                        href: `/appeals/${appeal.id}/timeline`,
                    },
                    { label: "Compare Rounds" },
                ]}
            />

            <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
                        Compare Rounds: {appeal.procedure}
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Side-by-side comparison of AI summaries, decision trees,
                        and evidence across appeal cycles.
                    </p>
                </div>
                <Link
                    href={`/appeals/${appeal.id}/timeline`}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                    Back to timeline
                </Link>
            </div>

            {appeal.cycles.length >= 2 && (
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <GitCompare className="size-4" />
                    Comparing {appeal.cycles.length} appeal levels for{" "}
                    {appeal.caseId}
                </p>
            )}

            <div className="mt-6">
                <RoundCompareView
                    appealId={appeal.id}
                    caseId={appeal.caseId}
                    submitted={appeal.submitted}
                    defaults={{
                        events: appeal.events,
                        cycles: appeal.cycles,
                        status: appeal.status,
                        lastUpdated: appeal.lastUpdated,
                    }}
                    defaultLeftId={defaultLeftId}
                    defaultRightId={defaultRightId}
                />
            </div>
        </div>
    );
}
