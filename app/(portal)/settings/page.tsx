import { Breadcrumb } from "@/components/breadcrumb"
import { AppearanceSettings } from "@/components/appearance-settings"

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10">
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Settings" }]}
      />

      <header className="mt-3">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your portal preferences and account display options.
        </p>
      </header>

      <div className="mt-6 flex flex-col gap-6">
        <AppearanceSettings />

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-semibold text-card-foreground">
            Account
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your reviewer profile details.
          </p>
          <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Name
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                Karen Highland
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Role
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                Senior Reviewer
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Reviewer ID
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">4920</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Organization
              </dt>
              <dd className="mt-1 text-sm font-medium text-foreground">
                Reviewer Organization B
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}
