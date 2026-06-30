import Link from "next/link"
import { notFound } from "next/navigation"
import { FileText, AlertTriangle } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"
import { getAppeal, type Criterion } from "@/lib/data"

export default async function ClinicalLogicPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const req = getAppeal(id)
  if (!req) notFound()

  return (
    <div className="w-full">
      <Breadcrumb
        items={[
          { label: "Appeals", href: "/appeals" },
          { label: `Case #${req.caseId}`, href: `/appeals/${req.id}/timeline` },
          { label: "Clinical Logic" },
        ]}
      />

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          {req.drug ?? req.procedure} — Clinical Review
        </h1>
        <span className="rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
          {req.policyVersion}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-6 border-b border-border">
        <Link
          href={`/appeals/${req.id}`}
          className="border-b-2 border-transparent pb-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Overview
        </Link>
        <span className="border-b-2 border-primary pb-3 text-sm font-semibold text-primary">
          Decision Tree
        </span>
        <Link
          href={`/appeals/${req.id}/compare`}
          className="border-b-2 border-transparent pb-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Compare Appeal
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[20rem_1fr]">
        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Case Details
            </h2>
            <dl className="mt-4 space-y-4">
              <DetailItem label="Patient" value={req.patient.name} />
              <DetailItem
                label="DOB"
                value={`${req.patient.dob} (${req.patient.age}y)`}
              />
              <DetailItem label="Requesting MD" value={req.requestingMd} />
            </dl>
          </section>

          <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Policy Reference
            </h2>
            <Link
              href="#"
              className="mt-3 block text-sm font-semibold text-primary hover:underline"
            >
              {req.policyRef}
            </Link>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {req.policyGuideline}
            </p>
            <Button variant="outline" className="mt-4 w-full">
              <FileText className="size-4" />
              View Full PDF
            </Button>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-4">
            <h2 className="text-base font-bold text-foreground">
              Criterion Logic Table
            </h2>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="size-2 rounded-full bg-success" /> MET
              </span>
              <span className="flex items-center gap-1.5 text-foreground">
                <span className="size-2 rounded-full bg-destructive" /> NOT MET
              </span>
            </div>
          </header>

          <div className="divide-y divide-border">
            {req.criteria.map((c) => (
              <CriterionRow key={c.id} criterion={c} />
            ))}
          </div>

          {req.determinationIssue && (
            <div className="flex flex-col gap-4 border-t border-border p-5 lg:flex-row lg:items-stretch lg:justify-between">
              <div className="flex-1 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="size-4 text-destructive" />
                  <p className="text-sm font-bold text-destructive">
                    Determination Issue Identified
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Requirement{" "}
                  <span className="font-semibold text-foreground">
                    {req.determinationIssue.requirement}
                  </span>{" "}
                  {req.determinationIssue.detail}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 lg:w-56">
                <Button className="w-full">Send Denial Letter</Button>
                <Button variant="outline" className="w-full">
                  Request Info (RFI)
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm font-bold text-foreground">{value}</dd>
    </div>
  )
}

function StateBadge({ state }: { state: Criterion["state"] }) {
  const met = state === "met"
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-2 py-1 text-xs font-bold ${
        met ? "bg-success/12 text-success" : "bg-destructive/10 text-destructive"
      }`}
    >
      {met ? "MET" : "NOT MET"}
    </span>
  )
}

function CriterionRow({
  criterion,
  depth = 0,
}: {
  criterion: Criterion
  depth?: number
}) {
  const isChild = depth > 0
  return (
    <>
      <div
        className={`flex flex-wrap items-start gap-3 px-5 py-4 sm:flex-nowrap ${
          isChild ? "bg-secondary/20" : ""
        }`}
        style={{ paddingLeft: `${1.25 + depth * 1.75}rem` }}
      >
        <span
          className={`flex size-7 shrink-0 items-center justify-center rounded-md text-xs font-bold ${
            isChild
              ? "bg-muted text-muted-foreground"
              : "bg-primary/10 text-primary"
          }`}
        >
          {criterion.id}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground">{criterion.label}</h3>
          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
            {criterion.description}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <StateBadge state={criterion.state} />
        </div>
        <p className="w-full text-right text-xs italic text-muted-foreground sm:w-44">
          {criterion.evidence}
        </p>
      </div>
      {criterion.children?.map((child) => (
        <CriterionRow key={child.id} criterion={child} depth={depth + 1} />
      ))}
    </>
  )
}
