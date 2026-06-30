import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export function DocumentViewButton({ label = "View" }: { label?: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="shrink-0 gap-1.5"
      onClick={() => {}}
    >
      <Eye className="size-3.5" />
      {label}
    </Button>
  )
}
