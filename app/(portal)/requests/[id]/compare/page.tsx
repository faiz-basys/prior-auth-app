import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { CompareView } from "@/components/compare-view"
import { getRequest } from "@/lib/data"

export default async function ComparePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const req = getRequest(id)
  if (!req) notFound()

  if (!req.appeal) {
    return (
      <div className="mx-auto max-w-6xl">
        <Breadcrumb
          items={[
            { label: "Worklist", href: "/" },
            { label: `Case #${req.caseId}`, href: `/requests/${req.id}` },
            { label: "Compare Results" },
          ]}
        />
        <div className="mt-10 rounded-xl border border-border bg-card p-10 text-center shadow-sm">
          <h1 className="text-lg font-bold text-foreground">
            No appeal on record
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This request has not been appealed, so there is nothing to compare yet.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Breadcrumb
        items={[
          { label: "Requests", href: "/" },
          { label: `Case #${req.caseId}`, href: `/requests/${req.id}` },
          { label: "Compare Results" },
        ]}
      />
      <div className="mt-3">
        <CompareView req={req} />
      </div>
    </div>
  )
}
