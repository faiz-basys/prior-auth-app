import type { AppealCycle, WorkflowEvent } from "@/lib/appeal-workflow"
import type { Criterion } from "@/lib/data"

const lumbarFusionExclusions: Criterion[] = [
  {
    id: "E.1",
    label: "Active systemic or local infection at operative site",
    description:
      "Known active infection contraindicates elective spinal fusion.",
    state: "not-met",
    evidence: "No infection documented in clinical notes or labs.",
    patientMapping: "No fever, elevated WBC, or wound infection noted.",
    rationale:
      "Exclusion not present — no active infection identified in submitted records.",
    sourceRef: "Clinical_Notes_PCP.pdf",
  },
  {
    id: "E.2",
    label:
      "Fusion requested solely for axial low back pain without neural compression",
    description:
      "Fusion is not indicated when only low back pain is present without radiculopathy or instability.",
    state: "not-met",
    evidence: "Radicular leg pain and neural compression documented.",
    patientMapping:
      "Chart documents left leg radiculopathy correlating with L4-L5.",
    rationale:
      "Exclusion not present — neural compression and radicular symptoms are documented.",
  },
  {
    id: "E.3",
    label: "Untreated osteoporosis or metabolic bone disease",
    description: "Uncorrected bone disease increases fusion failure risk.",
    state: "not-met",
    evidence: "Metabolic panel within acceptable limits.",
    patientMapping: "Calcium, vitamin D, and bone markers unremarkable.",
    rationale:
      "Exclusion not present — no untreated metabolic bone disease identified.",
  },
]

export const workflowSeeds: Record<
  string,
  { cycles: AppealCycle[]; events: WorkflowEvent[] }
> = {
  "pa-902341": {
    cycles: [
      {
        id: "pa-902341-cycle-1",
        cycleNumber: 1,
        raisedAt: "Oct 24, 2023",
        label: "Round 1 — Initial submission (1 PT file)",
        status: "superseded",
        evidence: [
          {
            name: "Clinical_Notes_PCP.pdf",
            added: "Oct 24",
            size: "2.1 MB",
            type: "pdf",
            change: "unchanged",
          },
          {
            name: "PT_Records_V2.pdf",
            added: "Oct 22",
            size: "4.5 MB",
            type: "pdf",
            change: "insufficient",
            changeNote: "Only 6 weeks of PT documented.",
          },
        ],
        criteria: {
          inclusion: [
            {
              id: "A.1",
              label: "Diagnosis: Spondylolisthesis",
              description: "Confirmed radiographic diagnosis grade II or higher.",
              state: "met",
              evidence: "Imaging confirmed Aug 2023.",
              sourceRef: "MRI_Lumbar_Spine_0823.png",
              children: [
                {
                  id: "A.1.1",
                  label: "Radiographic Grade II+",
                  description: "Spondylolisthesis grade II or higher on imaging.",
                  state: "met",
                  evidence: "MRI Aug 2023 confirms grade II at L4-L5.",
                  sourceRef: "MRI_Lumbar_Spine_0823.png",
                },
              ],
            },
            {
              id: "A.2",
              label: "Failure of Conservative Mgmt (6mo)",
              description:
                "Documented failure of 6 months of conservative therapy including PT and ESI.",
              state: "not-met",
              evidence: "Only 6 weeks of PT documented in initial submission.",
              rationale:
                "This criterion is not met. Policy requires 12 weeks minimum of physical therapy; only 6 weeks were documented.",
              children: [
                {
                  id: "A.2.1",
                  label: "Physical Therapy (6 months)",
                  description: "Minimum 6 months of structured physical therapy.",
                  state: "not-met",
                  evidence: "Only 6 weeks of PT documented.",
                  sourceRef: "PT_Records_V2.pdf",
                  patientMapping:
                    "PT records show sessions from Sep 2023 to Oct 2023 only (6 weeks).",
                  rationale:
                    "This criterion is not met. Submitted PT documentation covers only 6 weeks, short of the 12-week policy minimum.",
                },
                {
                  id: "A.2.2",
                  label: "Epidural Steroid Injection",
                  description: "Trial of ESI unless contraindicated.",
                  state: "not-found",
                  evidence: "None",
                  patientMapping: "No ESI procedure found in submitted records.",
                  rationale:
                    "This criterion could not be evaluated — no epidural steroid injection documentation was found in the medical record.",
                },
              ],
            },
          ],
          exclusion: lumbarFusionExclusions,
        },
        aiSummary: {
          recommendation:
            "Deny coverage. Submitted documentation confirms only 6 weeks of physical therapy — policy CMS-L33747 requires 12 weeks minimum.",
          recommendationVerdict: "NOT APPROVED",
          confidence: 38,
          checks: [
            { label: "Medical Necessity", sublabel: "Failed", passed: false },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
          ],
          rationale: [
            {
              title: "Insufficient Conservative Therapy",
              detail:
                "Only 6 weeks of PT documented. Policy requires 12 weeks of conservative management.",
              reference: "PT_Records_V2.pdf",
            },
          ],
        },
        determinationIssue: {
          requirement: "A.2 (Failure of Conservative Mgmt)",
          detail: "has not been satisfied with initial submission.",
        },
      },
      {
        id: "pa-902341-cycle-2",
        cycleNumber: 2,
        raisedAt: "Oct 28, 2023",
        label: "Round 2 — Re-appeal with additional PT logs",
        status: "active",
        evidence: [
          {
            name: "MRI_Lumbar_Spine_0823.png",
            added: "Oct 24",
            size: "12.4 MB",
            type: "image",
            change: "unchanged",
          },
          {
            name: "Clinical_Notes_PCP.pdf",
            added: "Oct 24",
            size: "2.1 MB",
            type: "pdf",
            change: "unchanged",
          },
          {
            name: "PT_Logs_Oct-Jan.pdf",
            added: "Oct 28",
            size: "3.8 MB",
            type: "pdf",
            change: "new",
            changeNote: "Extended PT logs — 16 weeks documented.",
          },
          {
            name: "ESI_Record_Feb10.pdf",
            added: "Oct 28",
            size: "0.5 MB",
            type: "pdf",
            change: "new",
            changeNote: "Epidural steroid injection record.",
          },
          {
            name: "Lab_Results_Metabolic.pdf",
            added: "Oct 20",
            size: "0.8 MB",
            type: "lab",
            change: "unchanged",
          },
        ],
        criteria: {
          inclusion: [
            {
              id: "A.1",
              label: "Diagnosis: Spondylolisthesis",
              description: "Confirmed radiographic diagnosis grade II or higher.",
              state: "met",
              evidence: "Imaging confirmed Aug 2023.",
              sourceRef: "MRI_Lumbar_Spine_0823.png",
              children: [
                {
                  id: "A.1.1",
                  label: "Radiographic Grade II+",
                  description: "Spondylolisthesis grade II or higher on imaging.",
                  state: "met",
                  evidence: "MRI Aug 2023 confirms grade II at L4-L5.",
                  sourceRef: "MRI_Lumbar_Spine_0823.png",
                },
                {
                  id: "A.1.2",
                  label: "Clinical Symptom Correlation",
                  description: "Symptoms consistent with diagnosed condition.",
                  state: "met",
                  evidence: "Radicular leg pain documented in chart.",
                  sourceRef: "Clinical_Notes_PCP.pdf",
                },
              ],
            },
            {
              id: "A.2",
              label: "Failure of Conservative Mgmt (6mo)",
              description:
                "Documented failure of 6 months of conservative therapy including PT and ESI.",
              state: "met",
              evidence: "PT logs and ESI record satisfy policy requirement.",
              children: [
                {
                  id: "A.2.1",
                  label: "Physical Therapy (6 months)",
                  description: "Minimum 6 months of structured physical therapy.",
                  state: "met",
                  evidence: "PT logs Oct–Jan confirm 16 weeks of therapy.",
                  sourceRef: "PT_Logs_Oct-Jan.pdf",
                  patientMapping:
                    "32 PT sessions documented across 16 weeks (Oct 2022–Jan 2023).",
                  rationale:
                    "This criterion is met. Extended PT logs satisfy the conservative therapy requirement.",
                },
                {
                  id: "A.2.2",
                  label: "Epidural Steroid Injection",
                  description: "Trial of ESI unless contraindicated.",
                  state: "met",
                  evidence: "ESI performed Feb 10, 2023.",
                  sourceRef: "ESI_Record_Feb10.pdf",
                  patientMapping: "L4-L5 transforaminal ESI documented Feb 10, 2023.",
                  rationale:
                    "This criterion is met. ESI record confirms interventional conservative therapy prior to fusion request.",
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
          exclusion: lumbarFusionExclusions,
        },
        aiSummary: {
          recommendation:
            "Approve coverage: Appeal documentation confirms guideline compliance. Supplemental PT logs and ESI record satisfy previously unmet conservative therapy criteria.",
          recommendationVerdict: "APPROVED",
          confidence: 87,
          checks: [
            { label: "Medical Necessity", sublabel: "Passed", passed: true },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
          ],
          rationale: [
            {
              title: "Conservative Therapy Now Documented",
              detail:
                "PT logs (Oct–Jan) and ESI on Feb 10 satisfy CMS-L33747 conservative management requirements.",
              reference: "PT_Logs_Oct-Jan.pdf",
            },
            {
              title: "Imaging Correlation Confirmed",
              detail:
                "MRI confirms grade II spondylolisthesis with symptom correlation.",
            },
          ],
        },
      },
    ],
    events: [
      {
        id: "evt-902341-1",
        cycleNumber: 1,
        type: "appeal_raised",
        title: "Appeal Raised",
        description: "Level 1 appeal filed with initial clinical documentation (1 PT file).",
        timestamp: "2023-10-24T09:12:00",
      },
      {
        id: "evt-902341-2",
        cycleNumber: 1,
        type: "submit_med_director",
        title: "Submitted to Medical Director",
        description: "QMRU completed summary and submitted to Medical Director in A&G.",
        timestamp: "2023-10-26T14:00:00",
      },
      {
        id: "evt-902341-3",
        cycleNumber: 1,
        type: "med_director_review",
        title: "Medical Director Review",
        description: "Medical Director reviewed Round 1 decision tree.",
        timestamp: "2023-10-28T10:30:00",
      },
      {
        id: "evt-902341-4",
        cycleNumber: 1,
        type: "denied",
        title: "Appeal Denied",
        description: "Denial upheld — insufficient conservative therapy documentation.",
        timestamp: "2023-10-28T16:00:00",
        outcome: "deny",
      },
      {
        id: "evt-902341-5",
        cycleNumber: 2,
        type: "re_appeal_raised",
        title: "Re-appeal Raised",
        description:
          "Provider re-raised appeal with PT_Logs_Oct-Jan.pdf and ESI_Record_Feb10.pdf.",
        timestamp: "2023-10-28T17:30:00",
      },
      {
        id: "evt-902341-6",
        cycleNumber: 2,
        type: "submit_med_director",
        title: "Submitted to Medical Director",
        description: "Round 2 submitted for Medical Director review with updated AI analysis.",
        timestamp: "2023-11-01T09:00:00",
      },
    ],
  },
  "pa-882193": {
    cycles: [
      {
        id: "pa-882193-cycle-1",
        cycleNumber: 1,
        raisedAt: "Oct 21, 2023",
        label: "Round 1 — Pharmacy appeal (Mavacamten)",
        status: "active",
        evidence: [
          {
            name: "Echo_Report_Sept23.pdf",
            added: "Oct 21",
            size: "3.2 MB",
            type: "pdf",
            change: "unchanged",
          },
          {
            name: "Medication_History.pdf",
            added: "Oct 20",
            size: "0.6 MB",
            type: "pdf",
            change: "insufficient",
            changeNote: "Only 2-week Metoprolol trial documented.",
          },
        ],
        criteria: {
          inclusion: [
            {
              id: "A",
              label: "Confirmed oHCM diagnosis",
              description: "Obstructive hypertrophic cardiomyopathy on echocardiography.",
              state: "met",
              evidence: "Echo confirmed Sept 2023.",
              sourceRef: "Echo_Report_Sept23.pdf",
              children: [
                {
                  id: "A.2",
                  label: "Prior Therapy Failure",
                  description: "Inadequate response to first-line beta-blocker therapy.",
                  state: "not-met",
                  evidence: "Only 2 weeks trial of Metoprolol documented.",
                  sourceRef: "Medication_History.pdf",
                  rationale:
                    "This criterion is not met. Policy requires a minimum 30-day trial of first-line therapy.",
                },
              ],
            },
          ],
          exclusion: [
            {
              id: "E.1",
              label: "LVEF below 50%",
              description: "Reduced ejection fraction contraindicates Mavacamten initiation.",
              state: "not-met",
              evidence: "LVEF 62% on September echo.",
              sourceRef: "Echo_Report_Sept23.pdf",
              rationale: "Exclusion not present — LVEF is within acceptable range.",
            },
            {
              id: "E.2",
              label: "Pregnancy or nursing",
              description: "Mavacamten is contraindicated during pregnancy and lactation.",
              state: "not-met",
              evidence: "No pregnancy documented in chart.",
              rationale: "Exclusion not present — patient is not pregnant or nursing.",
            },
          ],
        },
        aiSummary: {
          recommendation:
            "Uphold denial. Documentation does not satisfy 30-day prior therapy failure requirement.",
          recommendationVerdict: "NOT APPROVED",
          confidence: 71,
          checks: [
            { label: "Medical Necessity", sublabel: "Failed", passed: false },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
          ],
          rationale: [
            {
              title: "Prior Therapy Failure Not Documented",
              detail: "Only 2-week Metoprolol trial. Policy requires 30-day minimum.",
            },
          ],
        },
        determinationIssue: {
          requirement: "A.2 (Prior Therapy Failure)",
          detail: "has not been satisfied.",
        },
      },
    ],
    events: [
      {
        id: "evt-882193-1",
        cycleNumber: 1,
        type: "appeal_raised",
        title: "Appeal Raised",
        description: "Pharmacy appeal filed for Mavacamten (Camzyos).",
        timestamp: "2023-10-21T11:05:00",
      },
      {
        id: "evt-882193-2",
        cycleNumber: 1,
        type: "route_pharmacy",
        title: "Routed to Pharmacy",
        description: "Pharmacy template created and submitted in A&G.",
        timestamp: "2023-10-22T09:00:00",
      },
      {
        id: "evt-882193-3",
        cycleNumber: 1,
        type: "pharmacy_review_complete",
        title: "Pharmacy Review Complete",
        description: "Pharmacy returned to QMRU with uphold recommendation.",
        timestamp: "2023-11-10T14:00:00",
      },
      {
        id: "evt-882193-4",
        cycleNumber: 1,
        type: "denied",
        title: "Appeal Denied",
        description: "Denial upheld after pharmacy and medical director review.",
        timestamp: "2023-11-18T15:15:00",
        outcome: "deny",
      },
    ],
  },
  "pa-771045": {
    cycles: [
      {
        id: "pa-771045-cycle-1",
        cycleNumber: 1,
        raisedAt: "Oct 18, 2023",
        label: "Round 1 — Initial Rituximab appeal",
        status: "active",
        evidence: [
          {
            name: "Pathology_Report.pdf",
            added: "Oct 18",
            size: "2.0 MB",
            type: "pdf",
            change: "unchanged",
          },
          {
            name: "Treatment_History_Summary.pdf",
            added: "Oct 18",
            size: "1.1 MB",
            type: "pdf",
            change: "insufficient",
            changeNote: "Missing R-CHOP dates and response assessment.",
          },
        ],
        criteria: {
          inclusion: [
            {
              id: "A",
              label: "Confirmed CD20-positive lymphoma",
              description: "Pathology confirms follicular lymphoma grade 2.",
              state: "met",
              evidence: "Pathology confirmed follicular lymphoma grade 2.",
              sourceRef: "Pathology_Report.pdf",
            },
            {
              id: "B",
              label: "Prior Therapy Requirements",
              description: "Documented prior line failure or contraindication.",
              state: "not-met",
              evidence: "No R-CHOP completion documented.",
              sourceRef: "Treatment_History_Summary.pdf",
              rationale:
                "This criterion is not met. First-line chemoimmunotherapy completion not documented.",
            },
          ],
          exclusion: [
            {
              id: "E.1",
              label: "Active hepatitis B infection",
              description: "Rituximab is contraindicated with active HBV.",
              state: "not-met",
              evidence: "HBsAg negative in labs.",
              rationale: "Exclusion not present — no active hepatitis B identified.",
            },
            {
              id: "E.2",
              label: "Pregnancy or nursing",
              description: "Rituximab is contraindicated during pregnancy and lactation.",
              state: "not-met",
              evidence: "No pregnancy documented in chart.",
              rationale: "Exclusion not present — patient is not pregnant or nursing.",
            },
          ],
        },
        aiSummary: {
          recommendation:
            "Pending review. Second-line Rituximab not supported without documented R-CHOP failure or contraindication.",
          recommendationVerdict: "PENDING",
          confidence: 58,
          checks: [
            { label: "Medical Necessity", sublabel: "Failed", passed: false },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
          ],
          rationale: [
            {
              title: "Prior Line of Therapy Not Documented",
              detail:
                "No R-CHOP completion or progression documented in submitted records.",
            },
          ],
        },
        determinationIssue: {
          requirement: "B.1 (First-Line Chemoimmunotherapy)",
          detail: "has not been satisfied.",
        },
      },
    ],
    events: [
      {
        id: "evt-771045-1",
        cycleNumber: 1,
        type: "appeal_raised",
        title: "Appeal Raised",
        description: "Level 1 appeal filed for Rituximab with pathology and treatment summary.",
        timestamp: "2023-10-18T15:21:00",
      },
      {
        id: "evt-771045-2",
        cycleNumber: 1,
        type: "submit_med_director",
        title: "Submitted to Medical Director",
        description: "QMRU summary submitted. Awaiting Medical Director decision.",
        timestamp: "2023-11-05T10:00:00",
      },
    ],
  },
}
