"use client"

import { Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AppealLetter } from "@/lib/appeal-letters"

export function LetterModal({
  letter,
  open,
  onClose,
}: {
  letter: AppealLetter
  open: boolean
  onClose: () => void
}) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close letter"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="letter-modal-title"
        className="relative flex max-h-[min(90vh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
      >
        <header className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h3
              id="letter-modal-title"
              className="text-lg font-bold text-foreground"
            >
              {letter.title}
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Generated {letter.generatedAt} · In-app correspondence
            </p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                Basys AI Summary
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {letter.aiSummary}
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-border bg-muted/30 p-4">
            <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
              {letter.body}
            </p>
          </div>
        </div>

        <footer className="border-t border-border px-5 py-4">
          <Button className="w-full sm:ml-auto sm:w-auto" onClick={onClose}>
            Close
          </Button>
        </footer>
      </div>
    </div>
  )
}
