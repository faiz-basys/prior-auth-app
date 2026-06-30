import { ScrollText } from "lucide-react"
import { DocumentViewButton } from "@/components/document-view-button"

export function PolicyContextSection({
  policyCodes,
  policyFile,
  policyRef,
}: {
  policyCodes: string[]
  policyFile: string
  policyRef: string
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <ScrollText className="size-4 shrink-0 text-primary" />
          <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Policy Context
          </h2>
        </div>
        <DocumentViewButton />
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {policyCodes.map((code) => (
          <span
            key={code}
            className="rounded-md bg-primary/10 px-2 py-1 font-mono text-xs font-medium text-primary"
          >
            {code}
          </span>
        ))}
      </div>
      <p className="mt-3 text-sm font-medium text-foreground">{policyFile}</p>
      <p className="mt-1 text-xs text-muted-foreground">{policyRef}</p>
    </section>
  )
}
