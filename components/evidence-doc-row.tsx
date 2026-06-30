import { BarChart3, FileText, ImageIcon } from "lucide-react"
import { DocumentViewButton } from "@/components/document-view-button"
import type { EvidenceDoc } from "@/lib/data"

const evidenceIcon = {
  image: ImageIcon,
  pdf: FileText,
  lab: BarChart3,
} as const

export function EvidenceDocRow({
  doc,
  meta,
}: {
  doc: EvidenceDoc | { name: string; description?: string }
  meta?: string
}) {
  const Icon =
    "type" in doc && doc.type in evidenceIcon
      ? evidenceIcon[doc.type as EvidenceDoc["type"]]
      : FileText

  const subtitle =
    meta ??
    ("added" in doc && "size" in doc
      ? `Added ${doc.added} · ${doc.size}${
          "changeNote" in doc && doc.changeNote ? ` · ${doc.changeNote}` : ""
        }`
      : doc.description)

  return (
    <li className="flex items-center justify-between gap-3 px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <Icon className="size-4 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {doc.name}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <DocumentViewButton />
    </li>
  )
}
