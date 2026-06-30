import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { AppealReviewSubtitle } from "@/components/appeal-review-subtitle";
import { AppealReviewWorkspace } from "@/components/appeal-review-workspace";
import { getAppeal } from "@/lib/data";

export default async function AppealDetailPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ cycle?: string }>;
}) {
    const { id } = await params;
    const { cycle: cycleId } = await searchParams;
    const req = getAppeal(id);
    if (!req) notFound();

    const workflowDefaults = {
        events: req.events,
        cycles: req.cycles,
        status: req.status,
        lastUpdated: req.lastUpdated,
    };

    return (
        <div className="w-full">
            <Breadcrumb
                items={[
                    { label: "Appeals", href: "/appeals" },
                    {
                        label: `Appeal #${req.caseId}`,
                        href: `/appeals/${req.id}/timeline`,
                    },
                    { label: "Review" },
                ]}
            />

            <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
                        Appeal Review: {req.procedure}
                    </h1>
                    <AppealReviewSubtitle
                        appealId={req.id}
                        caseId={req.caseId}
                        defaults={workflowDefaults}
                        requestedCycleId={cycleId}
                    />
                </div>
            </div>

            <AppealReviewWorkspace appeal={req} requestedCycleId={cycleId} />
        </div>
    );
}
