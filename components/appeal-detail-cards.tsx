import type { AppealRequest } from "@/lib/data"

export function AppealDetailCards({ appeal }: { appeal: AppealRequest }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <DetailCard title="Patient Details" name={appeal.patient.name}>
        <Field label="Email" value={appeal.patient.email} />
        <Field label="Address" value={appeal.patient.address} />
        <Field label="DOB" value={`${appeal.patient.dob} (${appeal.patient.age}y)`} />
      </DetailCard>
      <DetailCard title="Reviewer Details" name={appeal.reviewer.org}>
        <Field label="Email" value={appeal.reviewer.email} />
        <Field label="Reviewer" value={appeal.reviewer.name} />
      </DetailCard>
      <DetailCard title="Provider Details" name={appeal.provider.name}>
        <Field label="Email" value={appeal.provider.email} />
        <Field label="NPI" value={appeal.provider.npi} />
      </DetailCard>
    </div>
  )
}

function DetailCard({
  title,
  name,
  children,
}: {
  title: string
  name: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-3 text-base font-bold text-foreground">{name}</p>
      <div className="mt-2 space-y-1">{children}</div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm text-muted-foreground">
      {label}: <span className="text-foreground/80">{value}</span>
    </p>
  )
}
