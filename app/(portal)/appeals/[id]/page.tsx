import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { AppealReviewWorkspace } from "@/components/appeal-review-workspace"
import { getAppeal } from "@/lib/data"
import { getActiveCycle } from "@/lib/appeal-workflow"

export default async function AppealDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ cycle?: string }>
}) {
  const { id } = await params
  const { cycle: cycleId } = await searchParams
  const req = getAppeal(id)
  if (!req) notFound()

  const selectedCycle =
    (cycleId && req.cycles.find((c) => c.id === cycleId)) ??
    getActiveCycle(req.cycles)

  return (
    <div className="w-full">
      <Breadcrumb
        items={[
          { label: "Appeals", href: "/appeals" },
          {
            label: `Appeal #${req.caseId}`,
            href: `/appeals/${req.id}/timeline`,
          },
          { label: selectedCycle.label },
        ]}
      />

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Appeal Review: {req.procedure}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {req.caseId} · {selectedCycle.label}
          </p>
        </div>
      </div>

      <AppealReviewWorkspace
        appeal={req}
        initialCycleId={selectedCycle.id}
      />
    </div>
  )
}
