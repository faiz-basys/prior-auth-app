import type { ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppTopbar } from "@/components/app-topbar"
import { AppealWorkflowProvider } from "@/components/appeal-workflow-context"

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <AppealWorkflowProvider>
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
          <AppTopbar />
          <main className="flex-1 overflow-x-hidden px-4 py-6 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </AppealWorkflowProvider>
  )
}
