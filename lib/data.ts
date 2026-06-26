export type RequestStatus =
  | "Approved"
  | "Denied"
  | "Missing Info"
  | "Pending"
  | "In Review"

export type CriterionState = "met" | "not-met"

export interface Criterion {
  id: string
  label: string
  description: string
  state: CriterionState
  evidence: string
  children?: Criterion[]
}

export interface RationaleItem {
  title: string
  detail: string
  reference?: string
}

export interface EvidenceDoc {
  name: string
  added: string
  size: string
  type: "image" | "pdf" | "lab"
}

export interface AppealDetermination {
  decision: RequestStatus
  decisionDate: string
  reviewer: string
  reviewDate: string
  recommendation: string
  rationale: string
  evidenceDepth: number
  criteria: Criterion[]
}

export interface PriorAuthRequest {
  id: string
  caseId: string
  procedure: string
  procedureCode: string
  drug?: string
  policyName: string
  payerName: string
  status: RequestStatus
  lastUpdated: string
  submitted: string
  confidence: number
  recommendation: string
  recommendationVerdict: "NOT APPROVED" | "APPROVED" | "PENDING"
  checks: { label: string; sublabel: string; passed: boolean | null }[]
  rationale: RationaleItem[]
  policyCodes: string[]
  policyFile: string
  policyRef: string
  policyGuideline: string
  evidence: EvidenceDoc[]
  patient: {
    name: string
    dob: string
    age: number
    sex: string
    email: string
    address: string
  }
  provider: { name: string; email: string; address: string; npi: string }
  reviewer: { name: string; org: string; email: string }
  requestingMd: string
  criteria: Criterion[]
  determinationIssue?: { requirement: string; detail: string }
  policyVersion: string
  appeal?: AppealDetermination
}

export const requests: PriorAuthRequest[] = [
  {
    id: "pa-902341",
    caseId: "PA-902341",
    procedure: "Lumbar Spinal Fusion",
    procedureCode: "CPT 22612",
    policyName: "L33747 — Lumbar Fusion (CMS LCD)",
    payerName: "New Century Health",
    status: "Missing Info",
    lastUpdated: "Oct 24, 2023 · 09:12 AM",
    submitted: "Oct 24, 2023 · 09:12 AM",
    confidence: 64,
    recommendationVerdict: "NOT APPROVED",
    recommendation:
      "The requested procedure currently does not meet clinical medical necessity guidelines based on the submitted documentation. Specifically, conservative therapy requirements are incomplete.",
    checks: [
      { label: "Medical Necessity", sublabel: "Failed", passed: false },
      { label: "Plan Eligibility", sublabel: "Verified", passed: true },
      { label: "Provider Network", sublabel: "In-Network", passed: true },
    ],
    rationale: [
      {
        title: "Insufficient Conservative Therapy",
        detail:
          "Clinical policy CMS-L33747 requires at least 12 weeks of documented conservative management (physical therapy, NSAIDs, and activity modification). Submitted records only confirm 6 weeks of PT.",
        reference: "PT_Records_V2.pdf",
      },
      {
        title: "Missing Imaging Correlation",
        detail:
          "Radiographic findings must correlate with the clinical diagnosis of spondylolisthesis grade II or higher. MRI report dated 08/15/23 notes 'mild degenerative changes' but does not specify grading.",
      },
      {
        title: "Tobacco Cessation Requirement",
        detail:
          "For elective spinal fusion, policy requires a 6-week tobacco-free period. Patient chart indicates active smoking status as of last visit (10/02/23).",
      },
    ],
    policyCodes: ["CPT 22612", "CPT 22633", "ICD-10 M43.16"],
    policyFile: "L33747_Lumbar_Fusion.pdf",
    policyRef: "Policy #CMS-L33747",
    policyGuideline:
      "Lumbar Fusion Coverage Guideline for surgical intervention and conservative management requirements.",
    policyVersion: "v1.0 Last Update: Oct 12, 2023",
    evidence: [
      { name: "MRI_Lumbar_Spine_0823.png", added: "Oct 24", size: "12.4 MB", type: "image" },
      { name: "Clinical_Notes_PCP.pdf", added: "Oct 24", size: "2.1 MB", type: "pdf" },
      { name: "PT_Records_V2.pdf", added: "Oct 22", size: "4.5 MB", type: "pdf" },
      { name: "Lab_Results_Metabolic.pdf", added: "Oct 20", size: "0.8 MB", type: "lab" },
    ],
    patient: {
      name: "Jonathan Miller",
      dob: "03/18/1978",
      age: 45,
      sex: "M",
      email: "jonathan.miller@gmail.com",
      address: "7423 Willow Creek Drive, Austin, TX",
    },
    provider: {
      name: "Emma Watson, MD",
      email: "emma.watson@orthogroup.com",
      address: "210 Medical Center Blvd, Austin, TX",
      npi: "1457823901",
    },
    reviewer: {
      name: "Karen Highland",
      org: "Reviewer Organization B",
      email: "k.highland@revieworg.com",
    },
    requestingMd: "Dr. Aris Thompson, MD",
    criteria: [
      {
        id: "A",
        label: "Spinal Fusion Criteria",
        description: "Clinical indications for surgical intervention.",
        state: "not-met",
        evidence: "Conservative management incomplete.",
        children: [
          {
            id: "A.1",
            label: "Diagnosis: Spondylolisthesis",
            description: "Confirmed radiographic diagnosis grade II or higher.",
            state: "met",
            evidence: "Imaging confirmed Aug 2023.",
          },
          {
            id: "A.2",
            label: "Failure of Conservative Mgmt (6mo)",
            description:
              "Documented failure of 6 months of conservative therapy including PT and ESI.",
            state: "not-met",
            evidence:
              "Only 3 months of physical therapy documented in initial submission. No record of epidural steroid injections.",
          },
          {
            id: "A.3",
            label: "Imaging Correlation",
            description: "Radiographic findings correlate with clinical diagnosis.",
            state: "met",
            evidence: "MRI correlates with reported symptoms.",
          },
        ],
      },
    ],
    determinationIssue: {
      requirement: "A.2 (Failure of Conservative Mgmt)",
      detail:
        "has not been satisfied. The medical policy requires a minimum of 6 months trial of conservative therapy unless contraindicated.",
    },
    appeal: {
      decision: "Approved",
      decisionDate: "Apr 05",
      reviewer: "Dr. Sarah Jenkins (Board Certified)",
      reviewDate: "Nov 04, 2023",
      recommendation:
        "Approve coverage: Appeal documentation confirms guideline compliance.",
      rationale:
        "Appeal submission includes detailed physical therapy logs (Oct–Jan) and pharmacy records confirming completed conservative management. Supplemental records (Exhibits B–D) and an ESI on Feb 10 satisfy the previously unmet criterion. The clinical necessity is now clearly established through the newly verified documentation of failed conservative treatment and radiographic progression.",
      evidenceDepth: 3,
      criteria: [
        {
          id: "A",
          label: "Spinal Fusion Criteria",
          description: "Clinical indications for surgical intervention.",
          state: "met",
          evidence: "All criteria satisfied with new evidence.",
          children: [
            {
              id: "A.1",
              label: "Diagnosis: Spondylolisthesis",
              description: "Confirmed radiographic diagnosis grade II or higher.",
              state: "met",
              evidence: "Unchanged.",
            },
            {
              id: "A.2",
              label: "Failure of Conservative Mgmt (6mo)",
              description:
                "Supplemental records (Exhibits B-D) show prior PT from Oct-Jan and ESI on Feb 10. Criteria now satisfied.",
              state: "met",
              evidence: "Evidence Source: Dr. Aris Med Record (System ID: 99102-B)",
            },
            {
              id: "A.3",
              label: "Imaging Correlation",
              description: "Radiographic findings correlate with clinical diagnosis.",
              state: "met",
              evidence: "Unchanged.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "pa-882193",
    caseId: "PA-882193",
    procedure: "Mavacamten (Camzyos)",
    procedureCode: "J-Code J8499",
    drug: "Mavacamten (Camzyos)",
    policyName: "CAR-2023-44 — Hypertrophic Cardiomyopathy",
    payerName: "New Century Health",
    status: "Denied",
    lastUpdated: "Oct 24, 2023 · 02:40 PM",
    submitted: "Oct 21, 2023 · 11:05 AM",
    confidence: 71,
    recommendationVerdict: "NOT APPROVED",
    recommendation:
      "Documentation does not satisfy prior therapy failure requirements. A minimum 30-day trial of first-line therapy is required unless contraindicated.",
    checks: [
      { label: "Medical Necessity", sublabel: "Failed", passed: false },
      { label: "Plan Eligibility", sublabel: "Verified", passed: true },
      { label: "Provider Network", sublabel: "In-Network", passed: true },
    ],
    rationale: [
      {
        title: "Prior Therapy Failure Not Documented",
        detail:
          "Documentation shows only a 2-week trial of Metoprolol. Policy requires a minimum 30-day trial of beta-blockers or calcium channel blockers unless contraindicated.",
      },
      {
        title: "REMS Enrollment Confirmed",
        detail:
          "REMS program enrollment confirmed. Baseline LVEF recorded at 62%, meeting the ≥55% safety threshold.",
      },
    ],
    policyCodes: ["J-Code J8499", "ICD-10 I42.1"],
    policyFile: "CAR-2023-44_oHCM.pdf",
    policyRef: "Policy #CAR-2023-44",
    policyGuideline:
      "Hypertrophic Cardiomyopathy Guideline for Mavacamten administration and monitoring.",
    policyVersion: "v2.1 Last Update: Oct 24, 2023",
    evidence: [
      { name: "Echo_Report_Sept23.pdf", added: "Oct 21", size: "3.2 MB", type: "pdf" },
      { name: "Clinical_Summary.pdf", added: "Oct 21", size: "1.4 MB", type: "pdf" },
      { name: "Medication_History.pdf", added: "Oct 20", size: "0.6 MB", type: "pdf" },
    ],
    patient: {
      name: "Robert J. Anderson",
      dob: "05/14/1962",
      age: 61,
      sex: "M",
      email: "robert.anderson@gmail.com",
      address: "98 Park Lane, Boston, MA",
    },
    provider: {
      name: "Dr. Sarah Khalil, FACC",
      email: "s.khalil@cardiocare.com",
      address: "45 Cardiology Way, Boston, MA",
      npi: "1902347761",
    },
    reviewer: {
      name: "Karen Highland",
      org: "Reviewer Organization B",
      email: "k.highland@revieworg.com",
    },
    requestingMd: "Dr. Sarah Khalil, FACC",
    criteria: [
      {
        id: "A",
        label: "Inclusions & Diagnosis",
        description:
          "Confirmed diagnosis of symptomatic obstructive hypertrophic cardiomyopathy (oHCM).",
        state: "met",
        evidence: "Echo confirmed Sept 2023 (LVEF > 55%)",
        children: [
          {
            id: "A.1",
            label: "New York Heart Association (NYHA) Class",
            description: "Patient exhibits symptoms consistent with Class II or III.",
            state: "met",
            evidence: "NYHA Class III noted in clinical summary.",
          },
          {
            id: "A.2",
            label: "Prior Therapy Failure",
            description:
              "Inadequate response or intolerance to beta-blockers or calcium channel blockers.",
            state: "not-met",
            evidence: "Documentation shows only 2 weeks trial of Metoprolol.",
          },
        ],
      },
      {
        id: "B",
        label: "Indications for Use (Safety Monitoring)",
        description: "Required baseline screenings and ongoing safety commitments.",
        state: "met",
        evidence: "REMS program enrollment confirmed.",
        children: [
          {
            id: "B.1",
            label: "Left Ventricular Ejection Fraction (LVEF)",
            description: "Baseline LVEF must be greater than or equal to 55%.",
            state: "met",
            evidence: "Recorded LVEF: 62%.",
          },
        ],
      },
    ],
    determinationIssue: {
      requirement: "A.2 (Prior Therapy Failure)",
      detail:
        "has not been satisfied. The medical policy requires a minimum of 30 days trial for first-line therapies unless contraindicated.",
    },
  },
  {
    id: "pa-771045",
    caseId: "PA-771045",
    procedure: "Rituxan (Rituximab)",
    procedureCode: "J-Code J9312",
    drug: "Rituxan, Truxima, Ruxience, Riabni",
    policyName: "Rituxan, Truxima, Ruxience, Riabni, Rituxan Hycela",
    payerName: "New Century Health",
    status: "Approved",
    lastUpdated: "Jun 12, 2026 · 10:00 PM",
    submitted: "Jun 08, 2026 · 03:21 PM",
    confidence: 93,
    recommendationVerdict: "APPROVED",
    recommendation:
      "All clinical criteria satisfied. Diagnosis, prior therapy, and lab requirements meet medical policy guidelines.",
    checks: [
      { label: "Medical Necessity", sublabel: "Passed", passed: true },
      { label: "Plan Eligibility", sublabel: "Verified", passed: true },
      { label: "Provider Network", sublabel: "In-Network", passed: true },
    ],
    rationale: [
      {
        title: "Diagnosis Confirmed",
        detail:
          "Pathology confirms CD20-positive B-cell non-Hodgkin lymphoma. Diagnosis meets covered indication under policy.",
      },
      {
        title: "Prior Therapy Documented",
        detail:
          "Records confirm appropriate first-line therapy and response monitoring per guideline requirements.",
      },
    ],
    policyCodes: ["J-Code J9312", "ICD-10 C83.30"],
    policyFile: "Rituxan_Policy.pdf",
    policyRef: "Policy #ONC-2026-12",
    policyGuideline:
      "Oncology biologics guideline for Rituximab and biosimilar administration.",
    policyVersion: "v3.0 Last Update: Jun 01, 2026",
    evidence: [
      { name: "Pathology_Report.pdf", added: "Jun 08", size: "2.0 MB", type: "pdf" },
      { name: "Treatment_History.pdf", added: "Jun 07", size: "1.1 MB", type: "pdf" },
    ],
    patient: {
      name: "Jane Doe",
      dob: "11/02/1969",
      age: 56,
      sex: "F",
      email: "jane.doe@gmail.com",
      address: "7423 Willow Creek Drive",
    },
    provider: {
      name: "Emma Watson",
      email: "emma.watson@gmail.com",
      address: "—",
      npi: "1457823901",
    },
    reviewer: {
      name: "Karen Highland",
      org: "Reviewer Organization B",
      email: "k.highland@revieworg.com",
    },
    requestingMd: "Emma Watson, MD",
    criteria: [
      {
        id: "A",
        label: "Inclusions & Diagnosis",
        description: "Confirmed CD20-positive B-cell non-Hodgkin lymphoma.",
        state: "met",
        evidence: "Pathology confirmed.",
        children: [
          {
            id: "A.1",
            label: "Histology Confirmation",
            description: "Biopsy-confirmed histology required.",
            state: "met",
            evidence: "Biopsy report on file.",
          },
        ],
      },
    ],
  },
]

export function getRequest(id: string) {
  return requests.find((r) => r.id === id)
}

export const statusStyles: Record<RequestStatus, string> = {
  Approved: "bg-success/12 text-success border-success/25",
  Denied: "bg-destructive/10 text-destructive border-destructive/25",
  "Missing Info": "bg-warning/15 text-warning border-warning/30",
  Pending: "bg-muted text-muted-foreground border-border",
  "In Review": "bg-primary/10 text-primary border-primary/25",
}
