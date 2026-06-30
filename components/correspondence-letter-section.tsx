"use client"

import { useState } from "react"
import { FileSignature } from "lucide-react"
import { LetterModal } from "@/components/letter-modal"
import { LetterViewButton } from "@/components/letter-view-button"
import type { AppealLetter } from "@/lib/appeal-letters"
import { letterSectionAccent } from "@/lib/appeal-letters"
import { cn } from "@/lib/utils"

export function CorrespondenceLetterSection({
  letter,
}: {
  letter: AppealLetter
}) {
  const [open, setOpen] = useState(false)
  const accent = letterSectionAccent(letter.type)

  return (
    <>
      <section
        className={cn(
          "overflow-hidden rounded-xl border bg-card shadow-sm",
          accent.border,
        )}
      >
        <header
          className={cn(
            "flex items-center justify-between gap-3 border-b px-5 py-4",
            accent.header,
          )}
        >
          <div className="flex items-center gap-2">
            <FileSignature className={cn("size-4", accent.title)} />
            <h2
              className={cn(
                "text-xs font-semibold uppercase tracking-wide",
                accent.title,
              )}
            >
              {letter.title}
            </h2>
          </div>
          <LetterViewButton onClick={() => setOpen(true)} />
        </header>
        <div className="px-5 py-4">
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
            {letter.aiSummary}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Generated {letter.generatedAt}
          </p>
        </div>
      </section>

      <LetterModal letter={letter} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
