import { BookOpen, Clock, LifeBuoy, Mail, Phone } from "lucide-react"
import { Breadcrumb } from "@/components/breadcrumb"
import { Button } from "@/components/ui/button"

const faqs = [
  {
    question: "How do I compare an appeal submission to the original request?",
    answer:
      "Open an appeal from the Appeals list, then use the Compare tab to view side-by-side documentation and policy criteria.",
  },
  {
    question: "Where can I find clinical logic for a determination?",
    answer:
      "From any appeal detail page, select Clinical Logic to review the automated criteria evaluation and supporting evidence.",
  },
  {
    question: "What do the different status badges mean?",
    answer:
      "Pending and In Review indicate active cases. Missing Info means additional documentation is required. Approved and Denied reflect final determinations.",
  },
  {
    question: "How do I escalate a complex case?",
    answer:
      "Contact the Clinical Review supervisor listed below or submit a ticket through the IT Service Desk with the case ID.",
  },
]

const resources = [
  { title: "Appeals Workflow Guide", description: "Step-by-step review process" },
  { title: "Policy Criteria Reference", description: "Common payer policy mappings" },
  { title: "Documentation Standards", description: "Required fields by procedure type" },
]

export default function SupportPage() {
  return (
    <div className="w-full">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Support" },
        ]}
      />

      <div className="mt-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
          Support
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get help with the Clinical Review Portal, workflows, and case handling.
        </p>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border border-border bg-card shadow-sm lg:col-span-2">
          <header className="flex items-center gap-2 border-b border-border px-5 py-4">
            <LifeBuoy className="size-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              Frequently asked questions
            </h2>
          </header>
          <ul className="divide-y divide-border">
            {faqs.map((faq) => (
              <li key={faq.question} className="px-5 py-4">
                <p className="text-sm font-semibold text-foreground">
                  {faq.question}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {faq.answer}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-border bg-card shadow-sm">
            <header className="flex items-center gap-2 border-b border-border px-5 py-4">
              <Phone className="size-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Contact
              </h2>
            </header>
            <div className="flex flex-col gap-4 px-5 py-5">
              <ContactRow
                icon={Phone}
                label="Clinical Review Help Desk"
                value="1-800-555-0142"
              />
              <ContactRow
                icon={Mail}
                label="Email support"
                value="clinical-review@fhp.example.com"
              />
              <ContactRow
                icon={Clock}
                label="Hours"
                value="Mon–Fri, 7:00 AM – 7:00 PM ET"
              />
              <Button className="w-full" disabled>
                Submit a ticket
              </Button>
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card shadow-sm">
            <header className="flex items-center gap-2 border-b border-border px-5 py-4">
              <BookOpen className="size-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Resources
              </h2>
            </header>
            <ul className="divide-y divide-border">
              {resources.map((resource) => (
                <li key={resource.title} className="px-5 py-4">
                  <p className="text-sm font-semibold text-primary">
                    {resource.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {resource.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Phone
  label: string
  value: string
}) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
