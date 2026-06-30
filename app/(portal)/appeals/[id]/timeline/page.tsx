import { notFound } from "next/navigation"
import { Breadcrumb } from "@/components/breadcrumb"
import { AppealDetailCards } from "@/components/appeal-detail-cards"
import { AppealTimeline } from "@/components/appeal-timeline"
import { StatusBadge } from "@/components/status-badge"
import { getAppeal } from "@/lib/data"

export default async function AppealTimelinePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const appeal = getAppeal(id)
  if (!appeal) notFound()

  return (
    <div className="w-full">
      <Breadcrumb
        items={[
          { label: "Appeals", href: "/appeals" },
          {
            label: `Appeal #${appeal.caseId}`,
            href: `/appeals/${appeal.id}/timeline`,
          },
          { label: "Timeline" },
        ]}
      />

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Appeal Timeline: {appeal.procedure}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {appeal.caseId} · {appeal.procedureCode} · Submitted{" "}
            {appeal.submitted}
          </p>
        </div>
        <StatusBadge status={appeal.status} />
      </div>

      <section className="mt-6">
        <AppealDetailCards appeal={appeal} />
      </section>

      <section className="mt-6">
        <AppealTimeline
          appealId={appeal.id}
          defaults={{
            events: appeal.events,
            cycles: appeal.cycles,
            status: appeal.status,
            lastUpdated: appeal.lastUpdated,
          }}
        />
      </section>
    </div>
  )
}
