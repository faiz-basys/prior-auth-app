import { EvidenceDocRow } from "@/components/evidence-doc-row"
import { getRequiredDocumentation } from "@/lib/data"

export function RequiredDocumentationSection({
  caseId,
  submitted,
}: {
  caseId: string
  submitted?: string
}) {
  const docs = getRequiredDocumentation(caseId, submitted)

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <header className="border-b border-border px-5 py-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Required Documentation ({docs.length})
        </h2>
      </header>
      <ul className="divide-y divide-border">
        {docs.map((doc) => (
          <EvidenceDocRow key={doc.name} doc={doc} />
        ))}
      </ul>
    </section>
  )
}
