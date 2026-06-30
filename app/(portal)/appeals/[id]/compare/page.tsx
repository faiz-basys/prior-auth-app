import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { CompareView } from "@/components/compare-view"
import { getAppeal } from "@/lib/data"
import { featureFlags } from "@/lib/feature-flags"

export default async function ComparePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const req = getAppeal(id)
  if (!req) notFound()
  if (!featureFlags.comparison) notFound()

  if (!req.appeal) {
    return (
      <div className="w-full">
        <Breadcrumb
          items={[
            { label: "Appeals", href: "/appeals" },
            { label: `Case #${req.caseId}`, href: `/appeals/${req.id}/timeline` },
            { label: "Compare Results" },
          ]}
        />
        <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center shadow-sm">
          <h1 className="text-lg font-bold text-foreground">
            No appeal on record
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This appeal has no comparison data yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <Breadcrumb
        items={[
          { label: "Appeals", href: "/appeals" },
          { label: `Case #${req.caseId}`, href: `/appeals/${req.id}/timeline` },
          { label: "Compare Results" },
        ]}
      />
      <div className="mt-3">
        <CompareView req={req} />
      </div>
    </div>
  )
}
