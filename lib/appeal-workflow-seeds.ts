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
          rationale:
            "This determination is based on a structured review of the Round 1 submission against CMS-L33747 lumbar fusion criteria. The patient’s diagnosis of grade II spondylolisthesis at L4-L5 is supported by MRI dated August 2023 and correlates with documented radicular symptoms. However, the inclusion criterion for failure of conservative management is not satisfied. Submitted physical therapy records (PT_Records_V2.pdf) cover only six weeks of treatment, whereas the policy requires a minimum of twelve weeks of documented conservative therapy unless a clinical contraindication is noted. No epidural steroid injection record was found in the initial package, leaving criterion A.2.2 unevaluated as not found. Plan eligibility and provider network status were verified without issue. Exclusion screening did not identify active infection, isolated axial pain without neural compression, or untreated metabolic bone disease. Because the primary medical-necessity pathway depends on demonstrated failure of conservative care, Basys recommends upholding denial at this stage pending supplemental documentation.",
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
          rationale:
            "Following receipt of supplemental records in Round 2, Basys re-evaluated the appeal against the same CMS-L33747 decision tree. Diagnosis and imaging correlation criteria remain met: MRI confirms grade II spondylolisthesis at L4-L5 with symptom correlation documented in clinical notes. The prior gap in conservative management is now addressed. PT_Logs_Oct-Jan.pdf documents thirty-two sessions across sixteen weeks (October 2022 through January 2023), satisfying the structured physical therapy requirement. ESI_Record_Feb10.pdf confirms a transforaminal epidural steroid injection at L4-L5 on February 10, 2023, fulfilling the interventional conservative therapy expectation. Exclusion criteria continue to show no active infection, no isolated axial pain pattern, and no untreated bone disease. With all inclusion branches satisfied and no exclusions present, the evidence supports medical necessity for lumbar spinal fusion. Basys therefore recommends approving coverage and overturning the initial denial, with high confidence based on complete documentation of failed conservative care.",
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
          rationale:
            "Basys evaluated this pharmacy appeal for Mavacamten under policy CAR-2023-44 for obstructive hypertrophic cardiomyopathy. Inclusion criteria for confirmed oHCM on echocardiography are met based on Echo_Report_Sept23.pdf, which documents appropriate septal hypertrophy and symptom burden. REMS enrollment and baseline LVEF of 62% satisfy safety monitoring requirements, and exclusion screening shows no reduced ejection fraction below 55% and no pregnancy. The decisive factor is prior therapy failure. Policy requires documentation of an inadequate response to at least thirty days of first-line beta-blocker or calcium channel blocker therapy unless contraindicated. Medication_History.pdf reflects only a two-week trial of Metoprolol, which is insufficient to establish therapeutic failure. Without evidence of a completed first-line trial at guideline duration, the medical-necessity standard for Mavacamten initiation is not met. Plan eligibility and network status are confirmed. Basys recommends upholding the denial until extended medication records demonstrating a qualifying prior therapy trial are submitted.",
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
          rationale:
            "This Rituximab appeal is under active medical director review. Pathology_Report.pdf confirms CD20-positive follicular lymphoma grade 2, satisfying the diagnosis inclusion branch. The outstanding issue is prior line of therapy. Policy ONC-2023-12 requires documented failure of, or contraindication to, first-line chemoimmunotherapy before second-line Rituximab is supported. The original Treatment_History_Summary.pdf did not include R-CHOP infusion dates or a formal response assessment. The appeal package adds Infusion_Records_R-CHOP.pdf and PET_Restaging_Nov2023.pdf, which may address this gap, but dates and response interpretation require manual verification before a final determination. Exclusion screening for active hepatitis B and pregnancy is negative based on available records. Basys assigns moderate confidence pending confirmation that first-line therapy was completed and progression or intolerance is adequately documented. A final approve or deny recommendation will follow medical director validation of the supplemental infusion and imaging exhibits.",
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
  "pa-664821": {
    cycles: [
      {
        id: "pa-664821-cycle-1",
        cycleNumber: 1,
        raisedAt: "Nov 02, 2023",
        label: "Round 1 — Dupixent appeal",
        status: "active",
        evidence: [
          {
            name: "Derm_Assessment_Nov02.pdf",
            added: "Nov 02",
            size: "1.2 MB",
            type: "pdf",
            change: "new",
          },
          {
            name: "Topical_Therapy_History.pdf",
            added: "Nov 02",
            size: "0.5 MB",
            type: "pdf",
            change: "new",
          },
        ],
        criteria: {
          inclusion: [
            {
              id: "A",
              label: "Moderate-to-severe atopic dermatitis",
              description: "EASI ≥16 or BSA ≥10% documented.",
              state: "met",
              evidence: "EASI 22, BSA 18% on dermatology assessment.",
              sourceRef: "Derm_Assessment_Nov02.pdf",
            },
            {
              id: "B",
              label: "Failure of topical therapies",
              description: "Documented inadequate response to high-potency topical steroids.",
              state: "met",
              evidence: "8-week topical steroid trial documented.",
              sourceRef: "Topical_Therapy_History.pdf",
            },
          ],
          exclusion: [
            {
              id: "E.1",
              label: "Active uncontrolled parasitic infection",
              state: "not-met",
              evidence: "No parasitic infection documented.",
            },
          ],
        },
        aiSummary: {
          recommendation:
            "Approve Dupilumab. Appeal satisfies severity and prior therapy criteria per DERM-2023-08.",
          recommendationVerdict: "APPROVED",
          confidence: 91,
          checks: [
            { label: "Medical Necessity", sublabel: "Passed", passed: true },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
          ],
          rationale:
            "Basys reviewed the Dupixent appeal under DERM-2023-08 for moderate-to-severe atopic dermatitis. Derm_Assessment_Nov02.pdf documents an EASI score of 22 and body surface area involvement of 18%, exceeding policy thresholds for biologic eligibility. Topical_Therapy_History.pdf confirms an eight-week trial of high-potency topical corticosteroids with persistent symptoms, establishing failure of conventional therapy. Exclusion review found no evidence of active uncontrolled parasitic infection. Plan eligibility and in-network provider status were verified. The initial denial appeared to rely on incomplete severity documentation in the original submission; the appeal materials now provide the clinical detail required to support Dupilumab initiation. All inclusion criteria are met and no exclusions apply. Basys recommends approving the appeal and overturning the prior denial, with high confidence that the submitted record aligns with medical necessity and policy intent for patients with inadequately controlled moderate-to-severe atopic dermatitis.",
        },
      },
    ],
    events: [
      {
        id: "evt-664821-1",
        cycleNumber: 1,
        type: "appeal_raised",
        title: "Appeal Raised",
        description: "Level 1 appeal filed for Dupixent with severity assessment and topical therapy history.",
        timestamp: "2023-11-02T08:30:00",
      },
      {
        id: "evt-664821-2",
        cycleNumber: 1,
        type: "submit_med_director",
        title: "Submitted to Medical Director",
        description: "QMRU summary submitted for medical director review.",
        timestamp: "2023-11-12T10:00:00",
      },
      {
        id: "evt-664821-3",
        cycleNumber: 1,
        type: "med_director_review",
        title: "Medical Director Review",
        description: "Medical Director reviewed appeal documentation and AI recommendation.",
        timestamp: "2023-11-20T14:30:00",
      },
      {
        id: "evt-664821-4",
        cycleNumber: 1,
        type: "approved",
        title: "Appeal Approved",
        description: "Coverage approved — appeal overturns initial denial.",
        timestamp: "2023-11-22T14:45:00",
        outcome: "approve",
      },
    ],
  },
  "pa-558902": {
    cycles: [
      {
        id: "pa-558902-cycle-1",
        cycleNumber: 1,
        raisedAt: "Nov 10, 2023",
        label: "Round 1 — SCS trial appeal",
        status: "active",
        evidence: [
          {
            name: "Pain_Management_Referral.pdf",
            added: "Nov 10",
            size: "0.9 MB",
            type: "pdf",
            change: "new",
          },
          {
            name: "PT_Summary_6mo.pdf",
            added: "Nov 10",
            size: "2.3 MB",
            type: "pdf",
            change: "unchanged",
          },
        ],
        criteria: {
          inclusion: [
            {
              id: "A",
              label: "Failed conservative management",
              description: "Documented PT and medication trials.",
              state: "met",
              evidence: "6 months PT on file.",
            },
            {
              id: "B",
              label: "4-week pain diary",
              description: "Daily pain scores over 4 consecutive weeks.",
              state: "not-found",
              evidence: "None",
              rationale: "Required pain diary not included in appeal submission.",
            },
          ],
          exclusion: [
            {
              id: "E.1",
              label: "Active implantable device infection",
              state: "not-met",
              evidence: "No active infection documented.",
            },
          ],
        },
        aiSummary: {
          recommendation:
            "Hold for missing information. Request 4-week pain diary before SCS trial determination.",
          recommendationVerdict: "PENDING",
          confidence: 52,
          checks: [
            { label: "Medical Necessity", sublabel: "Pending", passed: null },
            { label: "Plan Eligibility", sublabel: "Verified", passed: true },
            { label: "Provider Network", sublabel: "In-Network", passed: true },
          ],
          rationale:
            "Basys reviewed this spinal cord stimulator trial appeal under NEURO-2022-15. Documentation supports that the patient completed six months of conservative management, including physical therapy summarized in PT_Summary_6mo.pdf, which satisfies the failed conservative care inclusion branch. Pain_Management_Referral.pdf establishes clinical intent for SCS evaluation but does not substitute for required objective monitoring data. Policy mandates a minimum four-week pain diary with daily pain scores to demonstrate chronic intractable pain severity and baseline functional impact before trial implantation. No pain diary or functional assessment was located in the appeal submission, leaving criterion B marked as not found. Exclusion screening did not identify active implantable device infection. Because the missing diary prevents completion of the medical-necessity evaluation, Basys cannot approve or deny on the merits at this time. Basys recommends issuing a request for additional information so the provider can submit the pain diary and functional scores needed to finalize the determination.",
        },
        determinationIssue: {
          requirement: "B (4-Week Pain Diary)",
          detail: "has not been submitted.",
        },
      },
    ],
    events: [
      {
        id: "evt-558902-1",
        cycleNumber: 1,
        type: "appeal_raised",
        title: "Appeal Raised",
        description: "Appeal filed for spinal cord stimulator trial after initial denial.",
        timestamp: "2023-11-10T13:15:00",
      },
      {
        id: "evt-558902-2",
        cycleNumber: 1,
        type: "submit_med_director",
        title: "Submitted to Medical Director",
        description: "Case routed to medical director for appeal review.",
        timestamp: "2023-11-15T09:00:00",
      },
      {
        id: "evt-558902-3",
        cycleNumber: 1,
        type: "missing_info",
        title: "Missing Information Requested",
        description: "RFI sent to provider for 4-week pain diary and functional assessment.",
        timestamp: "2023-11-20T09:10:00",
        outcome: "missing_info",
      },
    ],
  },
  "pa-441203": {
    cycles: [
      {
        id: "pa-441203-cycle-1",
        cycleNumber: 1,
        raisedAt: "Nov 25, 2023",
        label: "Round 1 — MRI knee appeal",
        status: "active",
        evidence: [
          {
            name: "Appeal_Letter_PA-441203.pdf",
            added: "Nov 25",
            size: "0.3 MB",
            type: "pdf",
            change: "new",
          },
          {
            name: "Ortho_Clinic_Note.pdf",
            added: "Nov 25",
            size: "1.0 MB",
            type: "pdf",
            change: "new",
          },
        ],
        criteria: {
          inclusion: [
            {
              id: "A",
              label: "Knee MRI clinical indications",
              description: "Pending AI evaluation of orthopedic documentation.",
              state: "not-found",
              evidence: "Awaiting triage.",
            },
          ],
          exclusion: [],
        },
        aiSummary: {
          recommendation:
            "Appeal queued for intake. Clinical review and decision tree generation pending.",
          recommendationVerdict: "PENDING",
          confidence: 0,
          rationale:
            "This appeal was received on November 25, 2023 and is queued for clinical intake. Appeal_Letter_PA-441203.pdf and Ortho_Clinic_Note.pdf have been attached but have not yet been processed through the automated policy mapping engine. Basys has not generated a decision tree evaluation or medical-necessity score for CPT 73721 right knee MRI under RAD-2023-02. Eligibility, network, and clinical inclusion criteria remain pending until document extraction and criterion matching are complete. No determination issue has been identified at this stage because review has not started. Once intake finishes, Basys will produce a recommendation, confidence score, and narrative rationale based on whether the orthopedic documentation supports advanced imaging for the reported indication.",
          checks: [
            { label: "Medical Necessity", sublabel: "Pending", passed: null },
            { label: "Plan Eligibility", sublabel: "Pending", passed: null },
            { label: "Provider Network", sublabel: "Pending", passed: null },
          ],
        },
      },
    ],
    events: [
      {
        id: "evt-441203-1",
        cycleNumber: 1,
        type: "appeal_raised",
        title: "Appeal Raised",
        description: "Appeal submitted for right knee MRI after utilization denial.",
        timestamp: "2023-11-25T08:00:00",
      },
    ],
  },
}
