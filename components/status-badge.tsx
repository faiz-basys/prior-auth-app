import { cn } from "@/lib/utils"
import { statusStyles, type RequestStatus } from "@/lib/data"

export function StatusBadge({
  status,
  className,
}: {
  status: RequestStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
        statusStyles[status],
        className,
      )}
    >
      {status}
    </span>
  )
}
