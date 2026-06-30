import { Bell, Mail, Shield, User } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"

const notificationOptions = [
  { label: "New appeal assignments", enabled: true },
  { label: "Status change alerts", enabled: true },
  { label: "Missing documentation reminders", enabled: false },
  { label: "Weekly activity digest", enabled: true },
]

export default function SettingsPage() {
  return (
    <div className="w-full">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Settings" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Settings
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile, notifications, and portal preferences.
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <section className="rounded-xl border border-border bg-card shadow-sm">
          <header className="flex items-center gap-2 border-b border-border px-5 py-4">
            <User className="size-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Profile
            </h2>
          </header>
          <div className="grid gap-4 px-5 py-5 sm:grid-cols-2">
            <Field label="Full name" value="Karen Highland" />
            <Field label="Reviewer ID" value="4920" />
            <Field label="Email" value="karen.highland@fhp.example.com" />
            <Field label="Department" value="Clinical Review" />
          </div>
          <footer className="border-t border-border px-5 py-4">
            <Button variant="outline" disabled>
              Edit profile
            </Button>
          </footer>
        </section>

        <section className="rounded-xl border border-border bg-card shadow-sm">
          <header className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Bell className="size-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Notifications
            </h2>
          </header>
          <ul className="divide-y divide-border">
            {notificationOptions.map((option) => (
              <li
                key={option.label}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <span className="text-sm text-foreground">{option.label}</span>
                <span
                  className={
                    option.enabled
                      ? "rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success"
                      : "rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground"
                  }
                >
                  {option.enabled ? "On" : "Off"}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card shadow-sm">
          <header className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Shield className="size-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Security
            </h2>
          </header>
          <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
            <div>
              <p className="text-sm font-medium text-foreground">
                Multi-factor authentication
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Last verified 14 days ago via corporate SSO.
              </p>
            </div>
            <Button variant="outline" disabled>
              Manage MFA
            </Button>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card shadow-sm">
          <header className="flex items-center gap-2 border-b border-border px-5 py-4">
            <Mail className="size-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Email preferences
            </h2>
          </header>
          <div className="px-5 py-5">
            <p className="text-sm text-muted-foreground">
              Summary emails are sent to{" "}
              <span className="font-medium text-foreground">
                karen.highland@fhp.example.com
              </span>{" "}
              every Monday at 8:00 AM ET.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}
