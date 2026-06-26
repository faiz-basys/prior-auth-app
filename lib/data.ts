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

export type DocChange = "new" | "updated" | "unchanged" | "insufficient"

export interface EvidenceDoc {
  name: string
  added: string
  size: string
  type: "image" | "pdf" | "lab"
  preview?: string
  change?: DocChange
  changeNote?: string
  relatedDoc?: string
}

export interface AppealDetermination {
  decision: RequestStatus
  decisionDate: string
  reviewer: string
  reviewDate: string
  recommendation: string
  rationale: string
  compareSummary?: string
  evidenceDepth: number
  evidence: EvidenceDoc[]
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
  denialDate?: string
  originalReviewDate?: string
  appealOutcomeLabel?: string
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
    status: "In Review",
    lastUpdated: "Nov 04, 2023 · 11:30 AM",
    submitted: "Oct 24, 2023 · 09:12 AM",
    denialDate: "Mar 12",
    originalReviewDate: "Oct 12, 2023",
    appealOutcomeLabel: "Appeal · Overturn expected",
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
      {
        name: "MRI_Lumbar_Spine_0823.png",
        added: "Oct 24",
        size: "12.4 MB",
        type: "image",
        change: "unchanged",
        changeNote: "Same imaging referenced in appeal.",
        preview:
          "MRI Lumbar Spine — Aug 15, 2023\n\nFindings: Grade II spondylolisthesis at L4-L5 with moderate foraminal narrowing. Mild degenerative disc changes at L3-L4. No acute fracture or cord compression.\n\nImpression: Radiographic findings correlate with reported radicular symptoms.",
      },
      {
        name: "Clinical_Notes_PCP.pdf",
        added: "Oct 24",
        size: "2.1 MB",
        type: "pdf",
        change: "unchanged",
        changeNote: "No changes in appeal submission.",
        preview:
          "Primary Care Visit — Oct 02, 2023\n\nPatient reports persistent low back pain radiating to left leg despite 6 weeks of physical therapy. Active smoker. Referred to orthopedics for surgical evaluation.\n\nAssessment: Lumbar spondylolisthesis, chronic low back pain with radiculopathy.",
      },
      {
        name: "PT_Records_V2.pdf",
        added: "Oct 22",
        size: "4.5 MB",
        type: "pdf",
        change: "insufficient",
        changeNote: "Only 6 weeks of PT documented — gap filled by appeal PT logs.",
        relatedDoc: "PT_Logs_Oct-Jan.pdf",
        preview:
          "Physical Therapy Summary — Jun 2023 to Aug 2023\n\nTotal sessions: 12 over 6 weeks\nFocus: Core stabilization, lumbar flexion/extension\n\nNote: Records confirm 6 weeks of PT only. No documentation of epidural steroid injection or extended conservative trial.",
      },
      {
        name: "Lab_Results_Metabolic.pdf",
        added: "Oct 20",
        size: "0.8 MB",
        type: "lab",
        change: "unchanged",
        changeNote: "No changes in appeal submission.",
        preview:
          "Metabolic Panel — Oct 18, 2023\n\nAll values within normal limits. Pre-operative labs cleared for surgical planning.",
      },
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
            children: [
              {
                id: "A.1.1",
                label: "Radiographic Grade II+",
                description: "Spondylolisthesis grade II or higher on imaging.",
                state: "met",
                evidence: "MRI Aug 2023 confirms grade II at L4-L5.",
              },
              {
                id: "A.1.2",
                label: "Clinical Symptom Correlation",
                description: "Symptoms consistent with diagnosed condition.",
                state: "met",
                evidence: "Radicular leg pain documented in chart.",
              },
            ],
          },
          {
            id: "A.2",
            label: "Failure of Conservative Mgmt (6mo)",
            description:
              "Documented failure of 6 months of conservative therapy including PT and ESI.",
            state: "not-met",
            evidence:
              "Only 3 months of physical therapy documented in initial submission. No record of epidural steroid injections.",
            children: [
              {
                id: "A.2.1",
                label: "Physical Therapy (6 months)",
                description: "Minimum 6 months of structured physical therapy.",
                state: "not-met",
                evidence: "Only 3 months of PT documented in initial submission.",
              },
              {
                id: "A.2.2",
                label: "Epidural Steroid Injection",
                description: "Trial of ESI unless contraindicated.",
                state: "not-met",
                evidence: "No record of epidural steroid injections.",
              },
              {
                id: "A.2.3",
                label: "Pharmacologic Management",
                description: "Documented trial of NSAIDs or analgesics.",
                state: "met",
                evidence: "NSAID use noted in clinical notes.",
              },
            ],
          },
          {
            id: "A.3",
            label: "Imaging Correlation",
            description: "Radiographic findings correlate with clinical diagnosis.",
            state: "met",
            evidence: "MRI correlates with reported symptoms.",
            children: [
              {
                id: "A.3.1",
                label: "MRI Findings Match Diagnosis",
                description: "Imaging supports the stated diagnosis.",
                state: "met",
                evidence: "MRI findings consistent with spondylolisthesis.",
              },
              {
                id: "A.3.2",
                label: "Symptom Correlation Documented",
                description: "Clinical symptoms align with imaging.",
                state: "met",
                evidence: "Radicular symptoms correlate with L4-L5 level.",
              },
            ],
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
      compareSummary:
        "The primary discrepancy lies in the initial omission of Physical Therapy (PT) logs. The appeal successfully addressed this by providing a comprehensive medical record export. The clinical necessity is now clearly established through the newly verified documentation of failed conservative treatment and radiographic progression.",
      recommendation:
        "Approve coverage: Appeal documentation confirms guideline compliance.",
      rationale:
        "Appeal submission includes detailed physical therapy logs (Oct–Jan) and pharmacy records confirming completed conservative management. Supplemental records (Exhibits B–D) and an ESI on Feb 10 satisfy the previously unmet criterion. The clinical necessity is now clearly established through the newly verified documentation of failed conservative treatment and radiographic progression.",
      evidenceDepth: 3,
      evidence: [
        {
          name: "Appeal_Letter_PA-902341.pdf",
          added: "Oct 28",
          size: "0.4 MB",
          type: "pdf",
          change: "new",
          changeNote: "Formal appeal letter — not in original submission.",
          preview:
            "Formal Appeal Letter — Oct 28, 2023\n\nRe: Case PA-902341 — Jonathan Miller\n\nWe respectfully appeal the denial dated Mar 12, 2023 for lumbar spinal fusion (CPT 22612).\n\nThe initial determination cited incomplete conservative therapy. Enclosed supplemental documentation demonstrates 16 weeks of physical therapy (Oct 2022–Jan 2023), pharmacy records confirming NSAID regimen, and epidural steroid injection on Feb 10, 2023.\n\nWe request reconsideration based on the attached exhibits.\n\nSigned,\nDr. Aris Thompson, MD\nOrthopedic Surgery",
        },
        {
          name: "Letter_of_Medical_Necessity.pdf",
          added: "Oct 28",
          size: "0.6 MB",
          type: "pdf",
          change: "new",
          changeNote: "Supporting letter — not in original submission.",
          preview:
            "Letter of Medical Necessity\n\nPatient has failed conservative management including structured PT, pharmacologic therapy, and ESI. Persistent radiculopathy with imaging-confirmed grade II spondylolisthesis. Lumbar fusion is medically necessary to restore function and prevent neurologic progression.\n\nDr. Aris Thompson, MD",
        },
        {
          name: "PT_Logs_Oct-Jan.pdf",
          added: "Nov 01",
          size: "3.2 MB",
          type: "pdf",
          change: "updated",
          changeNote: "Full 16-week PT logs — supersedes incomplete PT_Records_V2.pdf.",
          relatedDoc: "PT_Records_V2.pdf",
          preview:
            "Physical Therapy Logs — Oct 2022 to Jan 2023\n\n32 sessions documented across 16 weeks.\nModalities: Manual therapy, McKenzie protocol, core strengthening.\n\nPatient completed full course with documented functional improvement plateau and persistent symptoms warranting surgical referral.",
        },
        {
          name: "Pharmacy_Records.pdf",
          added: "Nov 01",
          size: "1.1 MB",
          type: "pdf",
          change: "new",
          changeNote: "Pharmacy history — not in original submission.",
          preview:
            "Pharmacy Dispense History — Aug 2022 to Feb 2023\n\nIbuprofen 800mg — 90-day supply, refilled x3\nMeloxicam 15mg — 30-day supply x2\n\nConfirms ongoing pharmacologic conservative management during PT trial.",
        },
        {
          name: "Exhibit_B_ESI_Report.pdf",
          added: "Nov 01",
          size: "0.9 MB",
          type: "pdf",
          change: "new",
          changeNote: "ESI documentation — missing from original submission.",
          preview:
            "Epidural Steroid Injection Report — Feb 10, 2023\n\nProcedure: L4-L5 transforaminal ESI\nOutcome: Temporary relief (2 weeks), symptoms returned.\n\nDocuments interventional conservative therapy prior to fusion request.",
        },
        {
          name: "Dr_Aris_Supplemental_Record.pdf",
          added: "Nov 02",
          size: "5.4 MB",
          type: "pdf",
          change: "new",
          changeNote: "Consolidated supplemental chart export.",
          preview:
            "Supplemental Medical Record Export — System ID: 99102-B\n\nConsolidated chart notes, operative planning assessment, and updated imaging review confirming progression since initial submission.\n\nSupports appeal that all CMS-L33747 conservative therapy requirements are now satisfied.",
        },
      ],
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
              evidence: "Unchanged from original determination.",
              children: [
                {
                  id: "A.1.1",
                  label: "Radiographic Grade II+",
                  description: "Spondylolisthesis grade II or higher on imaging.",
                  state: "met",
                  evidence: "Unchanged.",
                },
                {
                  id: "A.1.2",
                  label: "Clinical Symptom Correlation",
                  description: "Symptoms consistent with diagnosed condition.",
                  state: "met",
                  evidence: "Unchanged.",
                },
              ],
            },
            {
              id: "A.2",
              label: "Failure of Conservative Mgmt (6mo)",
              description:
                "Supplemental records (Exhibits B-D) show prior PT from Oct-Jan and ESI on Feb 10. Criteria now satisfied.",
              state: "met",
              evidence: "Evidence Source: Dr. Aris Med Record (System ID: 99102-B)",
              children: [
                {
                  id: "A.2.1",
                  label: "Physical Therapy (6 months)",
                  description: "Minimum 6 months of structured physical therapy.",
                  state: "met",
                  evidence: "PT logs Oct–Jan confirm 16 weeks of therapy (Exhibit A).",
                },
                {
                  id: "A.2.2",
                  label: "Epidural Steroid Injection",
                  description: "Trial of ESI unless contraindicated.",
                  state: "met",
                  evidence: "ESI performed Feb 10, 2023 (Exhibit B).",
                },
                {
                  id: "A.2.3",
                  label: "Pharmacologic Management",
                  description: "Documented trial of NSAIDs or analgesics.",
                  state: "met",
                  evidence: "Pharmacy records confirm NSAID regimen (Exhibit C).",
                },
              ],
            },
            {
              id: "A.3",
              label: "Imaging Correlation",
              description: "Radiographic findings correlate with clinical diagnosis.",
              state: "met",
              evidence: "Unchanged from original determination.",
              children: [
                {
                  id: "A.3.1",
                  label: "MRI Findings Match Diagnosis",
                  description: "Imaging supports the stated diagnosis.",
                  state: "met",
                  evidence: "Unchanged.",
                },
                {
                  id: "A.3.2",
                  label: "Symptom Correlation Documented",
                  description: "Clinical symptoms align with imaging.",
                  state: "met",
                  evidence: "Unchanged.",
                },
              ],
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
    lastUpdated: "Nov 18, 2023 · 03:15 PM",
    submitted: "Oct 21, 2023 · 11:05 AM",
    denialDate: "Oct 24",
    originalReviewDate: "Oct 24, 2023",
    appealOutcomeLabel: "Appeal · Upheld",
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
      {
        name: "Echo_Report_Sept23.pdf",
        added: "Oct 21",
        size: "3.2 MB",
        type: "pdf",
        change: "unchanged",
        changeNote: "Same echo referenced in appeal.",
      },
      {
        name: "Clinical_Summary.pdf",
        added: "Oct 21",
        size: "1.4 MB",
        type: "pdf",
        change: "unchanged",
        changeNote: "No changes in appeal submission.",
      },
      {
        name: "Medication_History.pdf",
        added: "Oct 20",
        size: "0.6 MB",
        type: "pdf",
        change: "insufficient",
        changeNote: "Only 2-week Metoprolol trial documented.",
        relatedDoc: "Extended_Medication_History.pdf",
      },
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
    appeal: {
      decision: "Denied",
      decisionDate: "Nov 18",
      reviewer: "Dr. Sarah Jenkins (Board Certified)",
      reviewDate: "Nov 18, 2023",
      compareSummary:
        "The appeal submitted extended medication records, but documentation still confirms only a 21-day Metoprolol trial — short of the 30-day policy requirement. NYHA class and REMS criteria remain satisfied, but prior therapy failure criterion A.2 is unchanged. Original denial is upheld.",
      recommendation:
        "Uphold denial: Appeal documentation does not satisfy prior therapy failure requirements.",
      rationale:
        "Appeal includes pharmacy printout and cardiology attestation. Metoprolol 25mg BID documented from Oct 1–21, 2023 (21 days). Policy CAR-2023-44 requires minimum 30-day trial of beta-blockers or calcium channel blockers unless contraindicated. No intolerance documentation sufficient to bypass duration requirement.",
      evidenceDepth: 2,
      evidence: [
        {
          name: "Appeal_Letter_PA-882193.pdf",
          added: "Nov 02",
          size: "0.3 MB",
          type: "pdf",
          change: "new",
          changeNote: "Level 1 appeal letter — not in original submission.",
        },
        {
          name: "Extended_Medication_History.pdf",
          added: "Nov 02",
          size: "0.8 MB",
          type: "pdf",
          change: "updated",
          changeNote: "Extended records still show only 21-day Metoprolol trial.",
          relatedDoc: "Medication_History.pdf",
        },
        {
          name: "Cardiology_Attestation.pdf",
          added: "Nov 02",
          size: "0.5 MB",
          type: "pdf",
          change: "new",
          changeNote: "Physician letter — does not establish 30-day trial or intolerance.",
        },
      ],
      criteria: [
        {
          id: "A",
          label: "Inclusions & Diagnosis",
          description:
            "Confirmed diagnosis of symptomatic obstructive hypertrophic cardiomyopathy (oHCM).",
          state: "met",
          evidence: "Unchanged from original determination.",
          children: [
            {
              id: "A.1",
              label: "New York Heart Association (NYHA) Class",
              description: "Patient exhibits symptoms consistent with Class II or III.",
              state: "met",
              evidence: "Unchanged.",
            },
            {
              id: "A.2",
              label: "Prior Therapy Failure",
              description:
                "Appeal records show 21-day Metoprolol trial. Still below 30-day requirement.",
              state: "not-met",
              evidence: "Extended pharmacy records confirm Oct 1–21 only.",
            },
          ],
        },
        {
          id: "B",
          label: "Indications for Use (Safety Monitoring)",
          description: "Required baseline screenings and ongoing safety commitments.",
          state: "met",
          evidence: "Unchanged.",
          children: [
            {
              id: "B.1",
              label: "Left Ventricular Ejection Fraction (LVEF)",
              description: "Baseline LVEF must be greater than or equal to 55%.",
              state: "met",
              evidence: "Unchanged.",
            },
          ],
        },
      ],
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
    status: "In Review",
    lastUpdated: "Nov 08, 2023 · 10:00 AM",
    submitted: "Oct 18, 2023 · 03:21 PM",
    denialDate: "Oct 28",
    originalReviewDate: "Oct 28, 2023",
    appealOutcomeLabel: "Appeal · Pending review",
    confidence: 58,
    recommendationVerdict: "NOT APPROVED",
    recommendation:
      "Second-line Rituximab is not supported without documented failure or contraindication to first-line chemoimmunotherapy. Submitted records do not confirm prior R-CHOP completion or progression.",
    checks: [
      { label: "Medical Necessity", sublabel: "Failed", passed: false },
      { label: "Plan Eligibility", sublabel: "Verified", passed: true },
      { label: "Provider Network", sublabel: "In-Network", passed: true },
    ],
    rationale: [
      {
        title: "Prior Line of Therapy Not Documented",
        detail:
          "Policy requires documented failure of, or contraindication to, first-line chemoimmunotherapy (R-CHOP or equivalent). Treatment summary lists diagnosis only; no infusion dates or response assessment.",
      },
      {
        title: "Histology Confirmed",
        detail:
          "Pathology confirms CD20-positive follicular lymphoma grade 2. Diagnosis criterion is met.",
      },
    ],
    policyCodes: ["J-Code J9312", "ICD-10 C83.30"],
    policyFile: "Rituxan_Policy.pdf",
    policyRef: "Policy #ONC-2023-12",
    policyGuideline:
      "Oncology biologics guideline for Rituximab and biosimilar administration in B-cell lymphoma.",
    policyVersion: "v2.4 Last Update: Sep 15, 2023",
    evidence: [
      {
        name: "Pathology_Report.pdf",
        added: "Oct 18",
        size: "2.0 MB",
        type: "pdf",
        change: "unchanged",
        changeNote: "Diagnosis confirmed — not disputed in appeal.",
      },
      {
        name: "Treatment_History_Summary.pdf",
        added: "Oct 18",
        size: "1.1 MB",
        type: "pdf",
        change: "insufficient",
        changeNote: "Missing R-CHOP dates and response assessment.",
        relatedDoc: "Infusion_Records_R-CHOP.pdf",
      },
    ],
    patient: {
      name: "Jane Doe",
      dob: "11/02/1969",
      age: 54,
      sex: "F",
      email: "jane.doe@gmail.com",
      address: "7423 Willow Creek Drive, Austin, TX",
    },
    provider: {
      name: "Dr. Elena Morales, MD",
      email: "e.morales@oncologygroup.com",
      address: "500 Cancer Center Dr, Austin, TX",
      npi: "1457823901",
    },
    reviewer: {
      name: "Karen Highland",
      org: "Reviewer Organization B",
      email: "k.highland@revieworg.com",
    },
    requestingMd: "Dr. Elena Morales, MD",
    criteria: [
      {
        id: "A",
        label: "Inclusions & Diagnosis",
        description: "Confirmed CD20-positive B-cell non-Hodgkin lymphoma.",
        state: "met",
        evidence: "Pathology confirmed follicular lymphoma grade 2.",
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
      {
        id: "B",
        label: "Prior Therapy Requirements",
        description: "Documented prior line failure or contraindication.",
        state: "not-met",
        evidence: "No R-CHOP completion or progression documented.",
        children: [
          {
            id: "B.1",
            label: "First-Line Chemoimmunotherapy",
            description: "R-CHOP or equivalent trial documented.",
            state: "not-met",
            evidence: "Treatment summary lacks infusion dates.",
          },
          {
            id: "B.2",
            label: "Progression or Intolerance",
            description: "Relapse or inadequate response after first-line therapy.",
            state: "not-met",
            evidence: "No response assessment on file.",
          },
        ],
      },
    ],
    determinationIssue: {
      requirement: "B.1 (First-Line Chemoimmunotherapy)",
      detail:
        "has not been satisfied. Policy requires documented prior R-CHOP or equivalent before second-line Rituximab.",
    },
    appeal: {
      decision: "In Review",
      decisionDate: "Pending",
      reviewer: "Pending assignment",
      reviewDate: "Nov 08, 2023",
      compareSummary:
        "Level 1 appeal received with infusion records and restaging imaging. Reviewer is evaluating whether R-CHOP completion and progression are now documented. Diagnosis criterion remains met; prior therapy criteria are under active review.",
      recommendation:
        "Appeal under review: Awaiting verification of first-line therapy completion and disease progression.",
      rationale:
        "Appeal package includes infusion records (Exhibits A–C) and PET restaging report suggesting progression after 6 cycles R-CHOP. Payer review in progress to validate dates, response assessment, and policy alignment for second-line Rituximab.",
      evidenceDepth: 2,
      evidence: [
        {
          name: "Appeal_Letter_PA-771045.pdf",
          added: "Nov 05",
          size: "0.4 MB",
          type: "pdf",
          change: "new",
          changeNote: "Level 1 appeal letter — not in original submission.",
        },
        {
          name: "Infusion_Records_R-CHOP.pdf",
          added: "Nov 05",
          size: "2.8 MB",
          type: "pdf",
          change: "new",
          changeNote: "Chemo infusion dates — may address prior therapy gap.",
          relatedDoc: "Treatment_History_Summary.pdf",
        },
        {
          name: "PET_Restaging_Nov2023.pdf",
          added: "Nov 05",
          size: "4.1 MB",
          type: "pdf",
          change: "new",
          changeNote: "Restaging imaging submitted with appeal.",
        },
        {
          name: "Oncology_Progress_Note.pdf",
          added: "Nov 06",
          size: "0.7 MB",
          type: "pdf",
          change: "new",
          changeNote: "Progress note documenting relapse after first-line therapy.",
        },
      ],
      criteria: [
        {
          id: "A",
          label: "Inclusions & Diagnosis",
          description: "Confirmed CD20-positive B-cell non-Hodgkin lymphoma.",
          state: "met",
          evidence: "Unchanged from original determination.",
          children: [
            {
              id: "A.1",
              label: "Histology Confirmation",
              description: "Biopsy-confirmed histology required.",
              state: "met",
              evidence: "Unchanged.",
            },
          ],
        },
        {
          id: "B",
          label: "Prior Therapy Requirements",
          description: "Documented prior line failure or contraindication.",
          state: "not-met",
          evidence: "Under review — new infusion records submitted.",
          children: [
            {
              id: "B.1",
              label: "First-Line Chemoimmunotherapy",
              description: "Appeal infusion records show 6 R-CHOP cycles Jun–Sep 2023.",
              state: "met",
              evidence: "Pending verification against infusion logs (Exhibit A).",
            },
            {
              id: "B.2",
              label: "Progression or Intolerance",
              description: "PET restaging suggests progression — under review.",
              state: "not-met",
              evidence: "Awaiting radiology confirmation.",
            },
          ],
        },
      ],
    },
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
